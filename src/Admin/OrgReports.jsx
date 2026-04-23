import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Users,
  Layers,
  Shield,
  Activity,
  Video,
  BookOpen,
  ClipboardList,
  FolderOpen,
  Eye,
} from "lucide-react";

// ─── Import ONLY from your provided service files ─────────────────────────────
import { progressService } from "../services/progressService";
import userService from "../services/userService";
import videoService from "../services/videoService"; // getAllVideos()
import { courseService } from "../services/courseService"; // getAllCoursesForAdmin()
import {
  getAllQuizzes,
  getAssignmentsByBatch,
} from "../services/assessmentService";
import { getAllBatches } from "../services/batchService"; // GET /batch/admin/batches ✅
import fileService from "../services/fileService"; // getTrainerFiles(), getStudentFiles()

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function fmt(v) {
  return typeof v === "number" ? Math.round(v) : 0;
}
function pillCls(v) {
  return v >= 75
    ? "or3-pill-green"
    : v >= 50
      ? "or3-pill-amber"
      : "or3-pill-red";
}
function progColor(v) {
  return v >= 75 ? "#10b981" : v >= 50 ? "#f59e0b" : "#ef4444";
}
function initials(email = "") {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const AV_BG = [
  "#E1F5EE",
  "#EEEDFE",
  "#FAECE7",
  "#E6F1FB",
  "#FAEEDA",
  "#EAF3DE",
];
const AV_FG = [
  "#0F6E56",
  "#3C3489",
  "#993C1D",
  "#185FA5",
  "#854F0B",
  "#3B6D11",
];
const AV_GLO = [
  "rgba(16,185,129,0.4)",
  "rgba(139,92,246,0.4)",
  "rgba(239,68,68,0.4)",
  "rgba(59,130,246,0.4)",
  "rgba(245,158,11,0.4)",
  "rgba(20,184,166,0.4)",
];
const AV_COLORS = [
  { bg: "linear-gradient(135deg,#00FFB2,#00C87A)", text: "#003D24" },
  { bg: "linear-gradient(135deg,#A78BFA,#7C3AED)", text: "#EDE9FE" },
  { bg: "linear-gradient(135deg,#FB923C,#DC2626)", text: "#FFF7ED" },
  { bg: "linear-gradient(135deg,#38BDF8,#0369A1)", text: "#E0F2FE" },
  { bg: "linear-gradient(135deg,#FBBF24,#D97706)", text: "#1C1917" },
];

/* ─── Utility: safely extract array from any API response shape ── */
function toArr(res) {
  if (res.status !== "fulfilled") return [];
  const d = res.value?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.content)) return d.content;
  if (Array.isArray(d?.data)) return d.data;
  return [];
}

/* ─── Auth header helper ── */
const authH = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

/* ─── Fetch files per batch via native fetch (admin endpoint) ── */
async function fetchFilesForBatch(batchId) {
  try {
    const r = await fetch(`${API_BASE}/file/batch/${batchId}`, {
      headers: authH(),
    });
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d) ? d : Array.isArray(d?.content) ? d.content : [];
  } catch {
    return [];
  }
}

/* ─── broad email-field matcher — checks every possible field name ── */
function matchEmail(obj, email) {
  if (!obj || !email) return false;
  const e = email.toLowerCase();
  return (
    obj.trainerEmail?.toLowerCase() === e ||
    obj.uploaderEmail?.toLowerCase() === e ||
    obj.createdBy?.toLowerCase() === e ||
    obj.ownerEmail?.toLowerCase() === e ||
    obj.instructorEmail?.toLowerCase() === e ||
    obj.uploadedBy?.toLowerCase() === e ||
    obj.trainerid?.toLowerCase() === e ||
    obj.trainer?.toLowerCase() === e ||
    obj.trainer?.email?.toLowerCase() === e ||
    obj.createdByEmail?.toLowerCase() === e ||
    obj.assignedTrainer?.toLowerCase() === e ||
    (Array.isArray(obj.trainerEmails) &&
      obj.trainerEmails.map((x) => x.toLowerCase()).includes(e))
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */
function ProgressBar({ value, color, height = 7 }) {
  return (
    <div
      style={{
        flex: 1,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 4,
        height,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(value || 0, 100)}%`,
          height,
          borderRadius: 4,
          background: color,
          transition: "width .6s ease",
          boxShadow: `0 0 8px ${color}60`,
        }}
      />
    </div>
  );
}

function ContentBadge({ icon: Icon, label, count, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        borderRadius: 10,
        padding: "5px 10px",
      }}
    >
      <Icon size={12} color={color} />
      <span style={{ fontSize: 11, fontWeight: 600, color }}>{count}</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
        {label}
      </span>
    </div>
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

function RadarChart({ data }) {
  const axes = [
    { label: "Videos", val: data.videoWatchPercentage ?? 0 },
    { label: "Files", val: data.fileDownloadPercentage ?? 0 },
    { label: "Quizzes", val: data.quizCompletionPercentage ?? 0 },
    { label: "Assignments", val: data.assignmentCompletionPercentage ?? 0 },
    { label: "Course", val: data.courseProgressPercentage ?? 0 },
  ];
  const N = axes.length,
    cx = 140,
    cy = 130,
    r = 90;
  const ang = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (i, pct) => {
    const a = ang(i),
      d = (pct / 100) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  };
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
        <radialGradient id="rfill3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FFB2" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00FFB2" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {[20, 40, 60, 80, 100].map((ring) => (
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
        fill="url(#rfill3)"
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

function ContentRow({ icon: Icon, color, title, sub }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: `${color}15`,
          border: `1px solid ${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={14} color={color} />
      </div>
      <span
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.75)",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </span>
      {sub && (
        <span
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
            flexShrink: 0,
          }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   STUDENT DETAIL PANEL
══════════════════════════════════════════════════════════════════════════════ */
function StudentDetailPanel({ student, batchId, onBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    progressService
      .getStudentProgressInBatch(batchId, student.studentEmail)
      .then((res) => {
        setDetail(res.data);
        setLoading(false);
      })
      .catch(() => {
        setDetail(student);
        setLoading(false);
      });
  }, [student, batchId]);

  const d = detail || student;
  return (
    <div>
      <button className="or3-back-btn" onClick={onBack}>
        ← Back to batch students
      </button>
      {loading ? (
        <div
          className="or3-skeleton"
          style={{ height: 400, borderRadius: 16 }}
        />
      ) : (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
            padding: 24,
          }}
        >
          {/* Banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                background: AV_COLORS[0].bg,
                color: AV_COLORS[0].text,
                flexShrink: 0,
              }}
            >
              {initials(d.studentEmail)}
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  margin: 0,
                  color: "#fff",
                }}
              >
                {d.studentEmail}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  margin: "3px 0 0",
                }}
              >
                Batch{" "}
                <strong style={{ color: "rgba(255,255,255,0.7)" }}>
                  {d.batchId || batchId}
                </strong>
              </p>
            </div>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: `2px solid ${progColor(d.overallProgressPercentage)}55`,
                borderRadius: 16,
                padding: "12px 20px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  lineHeight: 1,
                  color: progColor(d.overallProgressPercentage),
                }}
              >
                {fmt(d.overallProgressPercentage)}%
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 3,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                overall
              </span>
            </div>
          </div>

          {/* Arc meters */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {[
              {
                label: "Videos",
                val: d.videoWatchPercentage,
                color: "#00FFB2",
                sub: `${d.videosWatched ?? 0}/${d.totalVideos ?? 0}`,
              },
              {
                label: "Files",
                val: d.fileDownloadPercentage,
                color: "#38BDF8",
                sub: `${d.filesDownloaded ?? 0}/${d.totalFiles ?? 0}`,
              },
              {
                label: "Quizzes",
                val: d.quizCompletionPercentage,
                color: "#A78BFA",
                sub: `${d.quizzesCompleted ?? 0}/${d.totalQuizzes ?? 0}`,
              },
              {
                label: "Assignments",
                val: d.assignmentCompletionPercentage,
                color: "#FB923C",
                sub: `${d.assignmentsCompleted ?? 0}/${d.totalAssignments ?? 0}`,
              },
              {
                label: "Course",
                val: d.courseProgressPercentage,
                color: "#FBBF24",
                sub: `${d.courseContentCompleted ?? 0}/${d.totalCourseContent ?? 0}`,
              },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  padding: "12px 8px 10px",
                  textAlign: "center",
                }}
              >
                <ArcMeter value={m.val || 0} color={m.color} size={90} />
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    margin: "4px 0 2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {m.label}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.3)",
                    margin: 0,
                  }}
                >
                  {m.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Breakdown + Radar */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 18,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  margin: "0 0 16px",
                }}
              >
                Progress Breakdown
              </p>
              {[
                {
                  label: "Video watch",
                  val: d.videoWatchPercentage,
                  color: "#00FFB2",
                },
                {
                  label: "File download",
                  val: d.fileDownloadPercentage,
                  color: "#38BDF8",
                },
                {
                  label: "Quiz",
                  val: d.quizCompletionPercentage,
                  color: "#A78BFA",
                },
                {
                  label: "Assignments",
                  val: d.assignmentCompletionPercentage,
                  color: "#FB923C",
                },
                {
                  label: "Course",
                  val: d.courseProgressPercentage,
                  color: "#FBBF24",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      width: 105,
                      flexShrink: 0,
                    }}
                  >
                    {m.label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      background: "rgba(255,255,255,0.07)",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(m.val || 0, 100)}%`,
                        height: 6,
                        borderRadius: 4,
                        background: m.color,
                        boxShadow: `0 0 8px ${m.color}`,
                        transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: m.color,
                      width: 40,
                      textAlign: "right",
                    }}
                  >
                    {fmt(m.val)}%
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  margin: "0 0 16px",
                  alignSelf: "flex-start",
                }}
              >
                Skill Radar
              </p>
              <RadarChart data={d} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TRAINER DETAIL
══════════════════════════════════════════════════════════════════════════════ */
function TrainerDetail({ trainer, onBack }) {
  const [progressReport, setProgressReport] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [content, setContent] = useState({
    videos: [],
    files: [],
    courses: [],
    quizzes: [],
    assignments: [],
    batches: [],
  });
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchStudents, setBatchStudents] = useState([]);
  const [batchStudLoading, setBatchStudLoading] = useState(false);
  const [batchStudError, setBatchStudError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("progress");
  const trainerEmail = trainer.email;

  useEffect(() => {
    /* ── 1. Progress report ── */
    setProgressLoading(true);
    progressService
      .getTrainerProgressReport(trainerEmail)
      .then((res) => {
        setProgressReport(res.data);
        setProgressLoading(false);
      })
      .catch((err) => {
        setProgressError(err.response?.data?.message || err.message);
        setProgressLoading(false);
      });

    /* ── 2. Content — fetch everything in parallel ── */
    setContentLoading(true);
    Promise.allSettled([
      videoService.getAllVideos(), // GET /video
      courseService.getAllCoursesForAdmin(), // GET /courses/admin
      getAllQuizzes(), // GET /quizzes  (admin token → allowed after gateway fix)
      getAllBatches(), // GET /batch/admin/batches
    ]).then(async ([vRes, cRes, qRes, bRes]) => {
      /* ── Videos ── */
      const allVideos = toArr(vRes);
      const videos = allVideos.filter((v) => matchEmail(v, trainerEmail));

      /* ── Courses ── */
      const courses = toArr(cRes).filter((c) => matchEmail(c, trainerEmail));

      /* ── Quizzes ── */
      const allQuizzes = toArr(qRes);
      const quizzes = allQuizzes.filter((q) => matchEmail(q, trainerEmail));

      /* ── Batches: grab ALL batches and filter by trainerEmail in every possible field ── */
      const allBatches = toArr(bRes);
      console.log("[OrgReports] allBatches sample:", allBatches.slice(0, 2));

      const batches = allBatches.filter((b) => matchEmail(b, trainerEmail));
      console.log(
        "[OrgReports] matched batches for",
        trainerEmail,
        ":",
        batches,
      );

      const batchIds = batches.map((b) => b.id ?? b.batchId).filter(Boolean);

      /* ── Files + Assignments: fetch per batch ── */
      let allFiles = [];
      let allAssignments = [];

      if (batchIds.length > 0) {
        const perBatchResults = await Promise.allSettled(
          batchIds.flatMap((batchId) => [
            fetchFilesForBatch(batchId).then((data) => ({
              type: "files",
              data,
            })),
            getAssignmentsByBatch(batchId)
              .then((r) => {
                const arr = Array.isArray(r.data)
                  ? r.data
                  : Array.isArray(r.data?.content)
                    ? r.data.content
                    : Array.isArray(r.data?.data)
                      ? r.data.data
                      : [];
                return { type: "assignments", data: arr };
              })
              .catch(() => ({ type: "assignments", data: [] })),
          ]),
        );

        const seenFiles = new Set(),
          seenAssigns = new Set();
        for (const res of perBatchResults) {
          if (res.status !== "fulfilled") continue;
          const { type, data } = res.value;
          const arr = Array.isArray(data)
            ? data
            : Array.isArray(data?.content)
              ? data.content
              : Array.isArray(data?.data)
                ? data.data
                : [];
          for (const item of arr) {
            const id =
              item.id ??
              item.fileId ??
              item.assignmentId ??
              JSON.stringify(item);
            if (type === "files" && !seenFiles.has(id)) {
              seenFiles.add(id);
              allFiles.push(item);
            }
            if (type === "assignments" && !seenAssigns.has(id)) {
              seenAssigns.add(id);
              allAssignments.push(item);
            }
          }
        }
      }

      setContent({
        videos,
        files: allFiles,
        courses,
        quizzes,
        assignments: allAssignments,
        batches,
      });
      if (batches.length > 0) setSelectedBatch(batches[0]);
      setContentLoading(false);
    });
  }, [trainerEmail]);

  /* ── Load batch students when batch changes ── */
  useEffect(() => {
    if (!selectedBatch) return;
    setBatchStudLoading(true);
    setBatchStudError(null);
    setBatchStudents([]);
    setSelectedStudent(null);
    const batchId = selectedBatch.id ?? selectedBatch.batchId;
    progressService
      .getBatchProgressReport(batchId)
      .then((res) => {
        // support both { studentReports: [] } and flat array
        const students =
          res.data?.studentReports ?? (Array.isArray(res.data) ? res.data : []);
        setBatchStudents(students);
        setBatchStudLoading(false);
      })
      .catch((err) => {
        setBatchStudError(err.response?.data?.message || err.message);
        setBatchStudLoading(false);
      });
  }, [selectedBatch]);

  const areas = progressReport
    ? [
        {
          label: "Video watch",
          val: progressReport.avgVideoWatchPercentage,
          color: "#10b981",
        },
        {
          label: "File download",
          val: progressReport.avgFileDownloadPercentage,
          color: "#38bdf8",
        },
        {
          label: "Quiz",
          val: progressReport.avgQuizCompletionPercentage,
          color: "#8b5cf6",
        },
        {
          label: "Assignments",
          val: progressReport.avgAssignmentCompletionPercentage,
          color: "#f97316",
        },
        {
          label: "Course",
          val: progressReport.avgCourseProgressPercentage,
          color: "#f59e0b",
        },
      ]
    : [];

  if (selectedStudent) {
    return (
      <StudentDetailPanel
        student={selectedStudent}
        batchId={selectedBatch?.id ?? selectedBatch?.batchId}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  return (
    <div>
      <button className="or3-back-btn" onClick={onBack}>
        ← Back to all trainers
      </button>

      {/* Trainer header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 700,
              background: `linear-gradient(135deg,${AV_BG[0]},${AV_BG[0]}cc)`,
              color: AV_FG[0],
              boxShadow: `0 4px 20px ${AV_GLO[0]}`,
              fontFamily: "'Syne',sans-serif",
            }}
          >
            {initials(trainerEmail)}
          </div>
          <div>
            <h2
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 20,
                fontWeight: 700,
                margin: 0,
                color: "rgba(255,255,255,0.95)",
              }}
            >
              {trainerEmail}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.45)",
                margin: "3px 0 0",
              }}
            >
              {trainer.displayName || "Trainer"}
            </p>
          </div>
        </div>
        {progressReport && (
          <span
            className={`or3-pill ${pillCls(progressReport.avgOverallProgressPercentage)}`}
            style={{ fontSize: 14, padding: "6px 16px" }}
          >
            {fmt(progressReport.avgOverallProgressPercentage)}% overall avg
          </span>
        )}
      </div>

      {/* Content stats badges */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: "1rem",
        }}
      >
        {contentLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="or3-skeleton"
              style={{ width: 90, height: 32, borderRadius: 10 }}
            />
          ))
        ) : (
          <>
            <ContentBadge
              icon={Video}
              label="Videos"
              count={content.videos.length}
              color="#f43f5e"
            />
            <ContentBadge
              icon={FolderOpen}
              label="Files"
              count={content.files.length}
              color="#2dd4bf"
            />
            <ContentBadge
              icon={BookOpen}
              label="Courses"
              count={content.courses.length}
              color="#c084fc"
            />
            <ContentBadge
              icon={BarChart3}
              label="Quizzes"
              count={content.quizzes.length}
              color="#a78bfa"
            />
            <ContentBadge
              icon={ClipboardList}
              label="Assignments"
              count={content.assignments.length}
              color="#f59e0b"
            />
            <ContentBadge
              icon={Users}
              label="Batches"
              count={content.batches.length}
              color="#22d3ee"
            />
          </>
        )}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: "1rem",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          padding: 4,
          width: "fit-content",
        }}
      >
        {[
          { key: "progress", label: "Progress Report" },
          { key: "content", label: "Content" },
          { key: "batches", label: "Batch Students" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              transition: "all .2s",
              background:
                activeTab === key
                  ? "linear-gradient(135deg,#2563eb,#06b6d4)"
                  : "transparent",
              color: activeTab === key ? "#fff" : "rgba(255,255,255,0.45)",
              boxShadow:
                activeTab === key ? "0 4px 20px rgba(37,99,235,0.4)" : "none",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ══ Progress Tab ══ */}
      {activeTab === "progress" && (
        <>
          {progressLoading && (
            <div
              className="or3-skeleton"
              style={{ height: 300, borderRadius: 16 }}
            />
          )}
          {progressError && (
            <div className="or3-error-box">
              <p style={{ margin: 0 }}>{progressError}</p>
            </div>
          )}
          {!progressLoading && !progressError && progressReport && (
            <>
              <div
                className="or3-metrics-grid"
                style={{ marginBottom: "1rem" }}
              >
                {[
                  { label: "Batches", value: progressReport.totalBatches },
                  {
                    label: "Students",
                    value: progressReport.totalStudentsHandled,
                  },
                  {
                    label: "Avg overall",
                    value: `${fmt(progressReport.avgOverallProgressPercentage)}%`,
                    color: progColor(
                      progressReport.avgOverallProgressPercentage,
                    ),
                  },
                  {
                    label: "Avg video",
                    value: `${fmt(progressReport.avgVideoWatchPercentage)}%`,
                  },
                  {
                    label: "Avg quiz",
                    value: `${fmt(progressReport.avgQuizCompletionPercentage)}%`,
                  },
                  {
                    label: "Avg assignment",
                    value: `${fmt(progressReport.avgAssignmentCompletionPercentage)}%`,
                  },
                ].map((m) => (
                  <div key={m.label} className="or3-mc">
                    <p className="or3-mc-label">{m.label}</p>
                    <p
                      className="or3-mc-val"
                      style={m.color ? { color: m.color } : {}}
                    >
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="or3-two-col">
                <div className="or3-card">
                  <p className="or3-section-label">Progress breakdown</p>
                  {areas.map((a) => (
                    <div
                      key={a.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.45)",
                          width: 110,
                          flexShrink: 0,
                        }}
                      >
                        {a.label}
                      </span>
                      <ProgressBar value={a.val} color={a.color} />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.85)",
                          width: 38,
                          textAlign: "right",
                        }}
                      >
                        {fmt(a.val)}%
                      </span>
                    </div>
                  ))}
                </div>
                <div className="or3-card">
                  <p className="or3-section-label">Score tiles</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {areas.map((a) => (
                      <div
                        key={a.label}
                        style={{
                          flex: "1 1 80px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 12,
                          padding: 12,
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: a.color,
                            fontFamily: "'Syne',sans-serif",
                            textShadow: `0 0 12px ${a.color}`,
                          }}
                        >
                          {fmt(a.val)}%
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.4)",
                            marginTop: 3,
                          }}
                        >
                          {a.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="or3-card">
                <p className="or3-section-label">
                  Batches ({progressReport.batchReports?.length || 0})
                </p>
                {(progressReport.batchReports || []).map((batch) => (
                  <div key={batch.batchId} className="or3-batch-row">
                    <div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          margin: 0,
                          color: "rgba(255,255,255,0.85)",
                        }}
                      >
                        Batch {batch.batchId}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.4)",
                          margin: "2px 0 0",
                        }}
                      >
                        {batch.totalStudents} students
                      </p>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                          minWidth: 120,
                        }}
                      >
                        {[
                          {
                            label: "Video",
                            val: batch.avgVideoWatchPercentage,
                            color: "#10b981",
                          },
                          {
                            label: "Quiz",
                            val: batch.avgQuizCompletionPercentage,
                            color: "#8b5cf6",
                          },
                        ].map((a) => (
                          <div
                            key={a.label}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 10,
                                color: "rgba(255,255,255,0.35)",
                                width: 30,
                              }}
                            >
                              {a.label}
                            </span>
                            <div
                              style={{
                                width: 70,
                                background: "rgba(255,255,255,0.08)",
                                borderRadius: 3,
                                height: 5,
                              }}
                            >
                              <div
                                style={{
                                  width: `${Math.min(a.val, 100)}%`,
                                  height: 5,
                                  borderRadius: 3,
                                  background: a.color,
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: 10,
                                color: "rgba(255,255,255,0.4)",
                              }}
                            >
                              {fmt(a.val)}%
                            </span>
                          </div>
                        ))}
                      </div>
                      <span
                        className={`or3-pill ${pillCls(batch.avgOverallProgressPercentage)}`}
                        style={{ fontSize: 12 }}
                      >
                        {fmt(batch.avgOverallProgressPercentage)}% avg
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ══ Content Tab ══ */}
      {activeTab === "content" && (
        <div>
          {contentLoading ? (
            <div
              className="or3-skeleton"
              style={{ height: 300, borderRadius: 16 }}
            />
          ) : (
            <>
              {/* Videos */}
              <div className="or3-card">
                <p
                  className="or3-section-label"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Video size={12} color="#f43f5e" /> Videos (
                  {content.videos.length})
                </p>
                {content.videos.length === 0 ? (
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.3)",
                      textAlign: "center",
                      padding: "1rem 0",
                    }}
                  >
                    No videos found
                  </p>
                ) : (
                  content.videos
                    .slice(0, 6)
                    .map((v, i) => (
                      <ContentRow
                        key={v.id || i}
                        icon={Video}
                        color="#f43f5e"
                        title={
                          v.title ||
                          v.fileName ||
                          v.videoTitle ||
                          v.originalFileName ||
                          "Untitled Video"
                        }
                        sub={
                          v.uploadedAt
                            ? new Date(v.uploadedAt).toLocaleDateString()
                            : v.createdAt
                              ? new Date(v.createdAt).toLocaleDateString()
                              : ""
                        }
                      />
                    ))
                )}
                {content.videos.length > 6 && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.3)",
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    +{content.videos.length - 6} more
                  </p>
                )}
              </div>

              {/* Courses */}
              <div className="or3-card">
                <p
                  className="or3-section-label"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <BookOpen size={12} color="#c084fc" /> Courses (
                  {content.courses.length})
                </p>
                {content.courses.length === 0 ? (
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.3)",
                      textAlign: "center",
                      padding: "1rem 0",
                    }}
                  >
                    No courses found
                  </p>
                ) : (
                  content.courses
                    .slice(0, 6)
                    .map((c, i) => (
                      <ContentRow
                        key={c.id || i}
                        icon={BookOpen}
                        color="#c084fc"
                        title={
                          c.title || c.courseName || c.name || "Untitled Course"
                        }
                        sub={
                          c.studentsEnrolled != null
                            ? `${c.studentsEnrolled} enrolled`
                            : ""
                        }
                      />
                    ))
                )}
                {content.courses.length > 6 && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.3)",
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    +{content.courses.length - 6} more
                  </p>
                )}
              </div>

              <div className="or3-two-col">
                {/* Files */}
                <div className="or3-card">
                  <p
                    className="or3-section-label"
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <FolderOpen size={12} color="#2dd4bf" /> Files (
                    {content.files.length})
                  </p>
                  {content.files.length === 0 ? (
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.3)",
                        textAlign: "center",
                        padding: "1rem 0",
                      }}
                    >
                      No files found
                    </p>
                  ) : (
                    content.files
                      .slice(0, 5)
                      .map((f, i) => (
                        <ContentRow
                          key={f.id || f.fileId || i}
                          icon={FolderOpen}
                          color="#2dd4bf"
                          title={
                            f.title ||
                            f.fileName ||
                            f.originalFileName ||
                            f.name ||
                            "Untitled"
                          }
                          sub={
                            f.uploadedAt
                              ? new Date(f.uploadedAt).toLocaleDateString()
                              : f.createdAt
                                ? new Date(f.createdAt).toLocaleDateString()
                                : ""
                          }
                        />
                      ))
                  )}
                  {content.files.length > 5 && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.3)",
                        textAlign: "center",
                        marginTop: 6,
                      }}
                    >
                      +{content.files.length - 5} more
                    </p>
                  )}
                </div>

                {/* Quizzes */}
                <div className="or3-card">
                  <p
                    className="or3-section-label"
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <BarChart3 size={12} color="#a78bfa" /> Quizzes (
                    {content.quizzes.length})
                  </p>
                  {content.quizzes.length === 0 ? (
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.3)",
                        textAlign: "center",
                        padding: "1rem 0",
                      }}
                    >
                      No quizzes found
                    </p>
                  ) : (
                    content.quizzes
                      .slice(0, 5)
                      .map((q, i) => (
                        <ContentRow
                          key={q.id || i}
                          icon={BarChart3}
                          color="#a78bfa"
                          title={
                            q.title || q.quizName || q.name || "Untitled Quiz"
                          }
                          sub=""
                        />
                      ))
                  )}
                  {content.quizzes.length > 5 && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.3)",
                        textAlign: "center",
                        marginTop: 6,
                      }}
                    >
                      +{content.quizzes.length - 5} more
                    </p>
                  )}
                </div>
              </div>

              {/* Assignments */}
              <div className="or3-card">
                <p
                  className="or3-section-label"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <ClipboardList size={12} color="#f59e0b" /> Assignments (
                  {content.assignments.length})
                </p>
                {content.assignments.length === 0 ? (
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.3)",
                      textAlign: "center",
                      padding: "1rem 0",
                    }}
                  >
                    No assignments found
                  </p>
                ) : (
                  content.assignments
                    .slice(0, 6)
                    .map((a, i) => (
                      <ContentRow
                        key={a.id || a.assignmentId || i}
                        icon={ClipboardList}
                        color="#f59e0b"
                        title={
                          a.title || a.assignmentName || a.name || "Untitled"
                        }
                        sub={
                          a.dueDate
                            ? new Date(a.dueDate) < new Date()
                              ? "Overdue"
                              : `Due ${new Date(a.dueDate).toLocaleDateString()}`
                            : ""
                        }
                      />
                    ))
                )}
                {content.assignments.length > 6 && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.3)",
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    +{content.assignments.length - 6} more
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ══ Batch Students Tab ══ */}
      {activeTab === "batches" && (
        <div>
          {content.batches.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: "1rem",
              }}
            >
              {content.batches.map((b) => {
                const bid = b.id ?? b.batchId;
                const selBid = selectedBatch?.id ?? selectedBatch?.batchId;
                const isActive = bid === selBid;
                return (
                  <button
                    key={bid}
                    onClick={() => setSelectedBatch(b)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 18px",
                      borderRadius: 50,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "'DM Sans',sans-serif",
                      transition: "all .2s",
                      border: isActive
                        ? "1px solid #10b981"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: isActive
                        ? "rgba(16,185,129,0.12)"
                        : "rgba(255,255,255,0.04)",
                      color: isActive ? "#10b981" : "rgba(255,255,255,0.5)",
                      boxShadow: isActive
                        ? "0 0 20px rgba(16,185,129,0.15)"
                        : "none",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "currentColor",
                      }}
                    />
                    Batch {b.name || bid}
                  </button>
                );
              })}
            </div>
          )}

          {batchStudLoading && (
            <div
              className="or3-skeleton"
              style={{ height: 300, borderRadius: 16 }}
            />
          )}
          {batchStudError && (
            <div className="or3-error-box">
              <p style={{ margin: 0 }}>{batchStudError}</p>
            </div>
          )}

          {!batchStudLoading && !batchStudError && batchStudents.length > 0 && (
            <div className="or3-card">
              <p className="or3-section-label">
                Students in Batch{" "}
                {selectedBatch?.name ||
                  selectedBatch?.id ||
                  selectedBatch?.batchId}{" "}
                ({batchStudents.length}) — click to view report
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {batchStudents.map((s, i) => (
                  <div
                    key={s.studentEmail}
                    onClick={() => setSelectedStudent(s)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 14,
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.03)",
                      transition: "all .2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.07)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.14)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.06)";
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        background: AV_BG[i % 6],
                        color: AV_FG[i % 6],
                        flexShrink: 0,
                      }}
                    >
                      {initials(s.studentEmail)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          margin: "0 0 5px",
                          color: "rgba(255,255,255,0.85)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.studentEmail}
                      </p>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[
                          { val: s.videoWatchPercentage, color: "#00FFB2" },
                          { val: s.quizCompletionPercentage, color: "#A78BFA" },
                          {
                            val: s.assignmentCompletionPercentage,
                            color: "#FB923C",
                          },
                        ].map((m, mi) => (
                          <div
                            key={mi}
                            style={{
                              flex: 1,
                              height: 3,
                              background: "rgba(255,255,255,0.08)",
                              borderRadius: 2,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(m.val || 0, 100)}%`,
                                height: 3,
                                borderRadius: 2,
                                background: m.color,
                                transition: "width 0.6s ease",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: progColor(s.overallProgressPercentage),
                        border: `1px solid ${progColor(s.overallProgressPercentage)}44`,
                        borderRadius: 20,
                        padding: "4px 12px",
                        flexShrink: 0,
                      }}
                    >
                      {fmt(s.overallProgressPercentage)}%
                    </div>
                    <Eye
                      size={14}
                      color="rgba(255,255,255,0.3)"
                      style={{ flexShrink: 0 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!batchStudLoading &&
            !batchStudError &&
            batchStudents.length === 0 &&
            selectedBatch && (
              <div
                className="or3-card"
                style={{ textAlign: "center", padding: "3rem 1rem" }}
              >
                <p style={{ color: "rgba(255,255,255,0.4)", margin: 0 }}>
                  No students found in Batch{" "}
                  {selectedBatch?.name ||
                    selectedBatch?.id ||
                    selectedBatch?.batchId}
                </p>
              </div>
            )}

          {!batchStudLoading && content.batches.length === 0 && (
            <div
              className="or3-card"
              style={{ textAlign: "center", padding: "3rem 1rem" }}
            >
              <p style={{ color: "rgba(255,255,255,0.4)", margin: 0 }}>
                No batches found for this trainer
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Trainer Card ───────────────────────────────────────────────────────── */
function TrainerCard({ trainer, index, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov
          ? "linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))"
          : "linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
        border: `1px solid ${hov ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        padding: "1.25rem",
        marginBottom: 10,
        cursor: "pointer",
        transition: "all .25s ease",
        transform: hov
          ? "translateY(-3px) scale(1.005)"
          : "translateY(0) scale(1)",
        boxShadow: hov
          ? `0 20px 60px rgba(0,0,0,0.5),0 0 40px ${AV_GLO[index % 6]},inset 0 1px 0 rgba(255,255,255,0.1)`
          : "0 4px 20px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: AV_GLO[index % 6],
          filter: "blur(40px)",
          opacity: hov ? 0.6 : 0.2,
          transition: "opacity .3s",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              background: `linear-gradient(135deg,${AV_BG[index % 6]},${AV_BG[index % 6]}cc)`,
              color: AV_FG[index % 6],
              boxShadow: `0 4px 16px ${AV_GLO[index % 6]},inset 0 1px 0 rgba(255,255,255,0.3)`,
              fontFamily: "'Syne',sans-serif",
            }}
          >
            {initials(trainer.email)}
          </div>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                margin: 0,
                color: "rgba(255,255,255,0.9)",
                fontFamily: "'Syne',sans-serif",
              }}
            >
              {trainer.email}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
                margin: "2px 0 0",
              }}
            >
              {trainer.displayName || "Trainer"}
            </p>
          </div>
        </div>
        <button
          className="or3-btn-sm"
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          <Eye size={12} /> View Details
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN OrgReports
══════════════════════════════════════════════════════════════════════════════ */
const OrgReports = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await userService.getUsers(0, 1000);
        const allUsers = res.data?.content || res.data || [];
        setTrainers(
          allUsers.filter(
            (u) =>
              u.roles === "ROLE_TRAINER" ||
              u.role === "ROLE_TRAINER" ||
              u.roles === "TRAINER" ||
              u.role === "TRAINER" ||
              (Array.isArray(u.roles) && u.roles.includes("ROLE_TRAINER")),
          ),
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load trainers",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "rgba(255,255,255,0.85)",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <style>{orStyles}</style>

      {/* HERO */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg,#0f1a35 0%,#1a1035 50%,#0f2535 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "20%",
            width: 400,
            height: 300,
            background:
              "radial-gradient(ellipse,rgba(59,130,246,0.15),transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-40%",
            right: "10%",
            width: 300,
            height: 250,
            background:
              "radial-gradient(ellipse,rgba(139,92,246,0.12),transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: "28px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#3b82f6",
                    boxShadow: "0 0 12px rgba(59,130,246,0.8)",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  Admin Portal
                </span>
              </div>
              <h1
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem,3vw,2.2rem)",
                  color: "#fff",
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Trainer Reports
              </h1>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 6,
                  fontWeight: 500,
                }}
              >
                Progress insights for all trainers
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { icon: Shield, label: "Secure", val: "Enterprise" },
              { icon: Activity, label: "Live Data", val: "Real-time" },
              { icon: Layers, label: "Progress Reports", val: "All Batches" },
            ].map(({ icon: Icon, label, val }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 14,
                  padding: "10px 16px",
                  backdropFilter: "blur(10px)",
                  boxShadow:
                    "0 4px 20px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "rgba(59,130,246,0.15)",
                    border: "1px solid rgba(59,130,246,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={14} color="#60a5fa" />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.85)",
                      margin: 0,
                    }}
                  >
                    {val}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.35)",
                      margin: 0,
                    }}
                  >
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "24px" }}>
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="or3-skeleton"
                style={{ height: 80, borderRadius: 16 }}
              />
            ))}
          </div>
        )}
        {!loading && error && (
          <div className="or3-error-box">
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {!loading && !error && selected && (
          <TrainerDetail trainer={selected} onBack={() => setSelected(null)} />
        )}

        {!loading && !error && !selected && (
          <>
            <div
              className="or3-metrics-grid"
              style={{ marginBottom: "1.25rem" }}
            >
              <div
                className="or3-mc"
                style={{ position: "relative", overflow: "hidden" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    opacity: 0.12,
                  }}
                >
                  <Users size={48} color="white" />
                </div>
                <p className="or3-mc-label">Total Trainers</p>
                <p className="or3-mc-val">{trainers.length}</p>
              </div>
            </div>

            {trainers.length === 0 ? (
              <div
                className="or3-card"
                style={{ textAlign: "center", padding: "3rem 1rem" }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    margin: 0,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  No trainers found
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    margin: "4px 0 0",
                  }}
                >
                  Add users with the{" "}
                  <code
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      padding: "1px 6px",
                      borderRadius: 4,
                    }}
                  >
                    ROLE_TRAINER
                  </code>{" "}
                  role in User Management.
                </p>
              </div>
            ) : (
              <div className="or3-card">
                <p className="or3-section-label">
                  All Trainers ({trainers.length})
                </p>
                {trainers.map((t, i) => (
                  <TrainerCard
                    key={t.id || t.email}
                    trainer={t}
                    index={i}
                    onClick={() => setSelected(t)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrgReports;

/* ─── Scoped CSS ────────────────────────────────────────────────────────────── */
const orStyles = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:wght@400;500;600&family=Outfit:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

.or3-metrics-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px; }
.or3-mc      { background:linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:14px 16px; box-shadow:0 4px 20px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.06); }
.or3-mc-label{ font-size:10px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:.06em; margin:0 0 6px; font-weight:600; font-family:'DM Sans',sans-serif; }
.or3-mc-val  { font-size:22px; font-weight:700; color:rgba(255,255,255,0.9); margin:0; font-family:'Syne',sans-serif; }

.or3-card     { background:linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02)); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:1.25rem; margin-bottom:1rem; box-shadow:0 4px 20px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05); }
.or3-two-col  { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:1rem; }
@media(max-width:640px){ .or3-two-col{ grid-template-columns:1fr; } }
.or3-section-label { font-size:10px; font-weight:600; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:.07em; margin:0 0 14px; font-family:'DM Sans',sans-serif; }

.or3-batch-row            { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
.or3-batch-row:last-child { border-bottom:none; }

.or3-pill       { display:inline-block; font-size:11px; padding:3px 10px; border-radius:10px; font-weight:600; }
.or3-pill-green { background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.2); }
.or3-pill-amber { background:rgba(245,158,11,0.15); color:#fbbf24; border:1px solid rgba(245,158,11,0.2); }
.or3-pill-red   { background:rgba(239,68,68,0.15);  color:#f87171; border:1px solid rgba(239,68,68,0.2); }

.or3-btn-sm      { padding:6px 14px; font-size:12px; border-radius:10px; cursor:pointer; font-weight:600; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.7); transition:all .15s; font-family:'DM Sans',sans-serif; white-space:nowrap; }
.or3-btn-sm:hover{ background:rgba(255,255,255,0.12); border-color:rgba(255,255,255,0.2); color:#fff; }

.or3-back-btn      { display:flex; align-items:center; gap:6px; font-size:13px; color:rgba(255,255,255,0.5); cursor:pointer; padding:6px 0; margin-bottom:1.25rem; background:none; border:none; font-family:'DM Sans',sans-serif; transition:color .15s; }
.or3-back-btn:hover{ color:rgba(255,255,255,0.9); }

.or3-skeleton { background:linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.08),rgba(255,255,255,0.04)); background-size:200% 100%; animation:or3-shimmer 1.5s ease-in-out infinite; }
@keyframes or3-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.or3-error-box { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2); border-radius:12px; padding:1rem 1.25rem; color:#f87171; }
`;
