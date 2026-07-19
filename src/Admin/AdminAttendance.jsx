import { useEffect, useState } from "react";
import attendanceService from "../services/attendanceService";
import {
  Users,
  Layers,
  ChevronDown,
  ChevronRight,
  CalendarCheck,
  UserCheck,
  AlertCircle,
  Download,
  Filter,
} from "lucide-react";

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const STAT_COLORS = {
  batches: "linear-gradient(135deg,#0e7490,#22d3ee)",
  sessions: "linear-gradient(135deg,#312e81,#a78bfa)",
  students: "linear-gradient(135deg,#064e3b,#34d399)",
};

function StatusDot({ status }) {
  const c =
    status === "PRESENT"
      ? "#10b981"
      : status === "ABSENT"
        ? "#f43f5e"
        : "#f59e0b";
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: c,
        marginRight: 6,
      }}
    />
  );
}
const selectStyle = (theme) => ({
  padding: "8px 10px",
  borderRadius: 8,
  border: `1px solid ${theme.bd}`,
  background: theme.card,
  color: theme.text,
  fontSize: 12,
});

const inputStyle = (theme) => ({
  padding: "8px 10px",
  borderRadius: 8,
  border: `1px solid ${theme.bd}`,
  background: theme.card,
  color: theme.text,
  fontSize: 12,
});

const btnStyle = (color) => ({
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: color,
  color: "#fff",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
});

const pill = (theme) => ({
  padding: "4px 10px",
  borderRadius: 8,
  background: theme.rowHover,
  border: `1px solid ${theme.bd}`,
  color: theme.text,
});

const thStyle = { padding: "6px 10px", fontWeight: 600 };
const tdStyle = { padding: "6px 10px" };

export default function AdminAttendance() {
  const [dark, setDark] = useState(isDark);
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ---- History / Filters / Excel (NEW) ----
  const [filterType, setFilterType] = useState("THIS_MONTH");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterBatchId, setFilterBatchId] = useState("");
  const [filterTrainerEmail, setFilterTrainerEmail] = useState("");
  const [filterStudentEmail, setFilterStudentEmail] = useState("");
  const [reportType, setReportType] = useState("STUDENT"); // STUDENT | SESSION
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    setLoading(true);
    attendanceService
      .getAdminAttendanceOverview()
      .then((r) => setOverview(r.data || []))
      .catch(() => setError("Failed to load attendance overview."))
      .finally(() => setLoading(false));
  }, []);

  const toggleBatch = async (batchId) => {
    if (expandedBatchId === batchId) {
      setExpandedBatchId(null);
      setDetail(null);
      return;
    }
    setExpandedBatchId(batchId);
    setDetail(null);
    setDetailLoading(true);
    try {
      const r = await attendanceService.getAdminBatchAttendance(batchId);
      setDetail(r.data);
    } catch {
      setDetail({ trainerAttendance: [], studentAttendance: {} });
    } finally {
      setDetailLoading(false);
    }
  };
  const buildFilterParams = () => ({
    filterType,
    startDate: filterType === "CUSTOM" ? startDate : undefined,
    endDate: filterType === "CUSTOM" ? endDate : undefined,
    batchId: filterBatchId || undefined,
    trainerEmail: filterTrainerEmail || undefined,
    studentEmail: filterStudentEmail || undefined,
  });

  const fetchHistory = async () => {
    if (filterType === "CUSTOM" && (!startDate || !endDate)) {
      setHistoryError("Select both start and end date for a custom range.");
      return;
    }
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const r = await attendanceService.getAdminHistory(buildFilterParams());
      setHistory(r.data);
    } catch {
      setHistoryError("Failed to load attendance history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDownload = async () => {
    if (filterType === "CUSTOM" && (!startDate || !endDate)) {
      setHistoryError("Select both start and end date for a custom range.");
      return;
    }
    setDownloading(true);
    try {
      const r = await attendanceService.downloadAdminReport({
        ...buildFilterParams(),
        type: reportType,
      });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "admin-attendance-report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setHistoryError("Failed to download report.");
    } finally {
      setDownloading(false);
    }
  };

  const totalSessions = overview.reduce(
    (s, b) => s + (b.sessionsMarked || 0),
    0,
  );
  const totalStudents = overview.reduce((s, b) => s + (b.studentCount || 0), 0);

  const theme = {
    bg: dark ? "#0a0a0a" : "#f1f5f9",
    card: dark ? "#111111" : "#ffffff",
    text: dark ? "#ffffff" : "#0f172a",
    mu: dark ? "#94a3b8" : "#64748b",
    bd: dark ? "rgba(255,255,255,0.06)" : "#e2e8f0",
    rowHover: dark ? "rgba(34,211,238,0.04)" : "rgba(34,211,238,0.025)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: "'Poppins',sans-serif",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1300,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.bd}`,
            borderRadius: 20,
            padding: "28px 32px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(34,211,238,.10)",
              border: "1px solid rgba(34,211,238,.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#22d3ee",
              flexShrink: 0,
            }}
          >
            <CalendarCheck size={24} />
          </div>
          <div>
            <h1
              style={{
                fontWeight: 700,
                fontSize: "clamp(1.3rem,3vw,1.6rem)",
                margin: "0 0 2px",
              }}
            >
              Organization{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#a78bfa,#22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Attendance
              </span>
            </h1>
            <p style={{ fontSize: 12, color: theme.mu, margin: 0 }}>
              Trainer and student attendance for batches in your organization.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 16,
          }}
        >
          {[
            {
              label: "Batches",
              value: overview.length,
              icon: <Layers size={18} />,
              bg: STAT_COLORS.batches,
            },
            {
              label: "Sessions Marked",
              value: totalSessions,
              icon: <CalendarCheck size={18} />,
              bg: STAT_COLORS.sessions,
            },
            {
              label: "Students Tracked",
              value: totalStudents,
              icon: <Users size={18} />,
              bg: STAT_COLORS.students,
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: s.bg,
                borderRadius: 20,
                padding: "20px 22px",
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "rgba(255,255,255,.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                {s.icon}
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".12em",
                  opacity: 0.65,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
        {/* HISTORY / FILTERS / EXCEL DOWNLOAD (NEW) */}
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.bd}`,
            borderRadius: 20,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "rgba(167,139,250,.10)",
                color: "#a78bfa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Filter size={15} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              Attendance History & Reports
            </span>
          </div>

          {/* FILTER ROW */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
            }}
          >
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={selectStyle(theme)}
            >
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_14_DAYS">Last 14 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="CUSTOM">Custom Range</option>
            </select>

            {filterType === "CUSTOM" && (
              <>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={inputStyle(theme)}
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={inputStyle(theme)}
                />
              </>
            )}

            <input
              type="text"
              placeholder="Batch ID"
              value={filterBatchId}
              onChange={(e) => setFilterBatchId(e.target.value)}
              style={{ ...inputStyle(theme), width: 90 }}
            />
            <input
              type="text"
              placeholder="Trainer email"
              value={filterTrainerEmail}
              onChange={(e) => setFilterTrainerEmail(e.target.value)}
              style={{ ...inputStyle(theme), width: 160 }}
            />
            <input
              type="text"
              placeholder="Student email"
              value={filterStudentEmail}
              onChange={(e) => setFilterStudentEmail(e.target.value)}
              style={{ ...inputStyle(theme), width: 160 }}
            />

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={selectStyle(theme)}
            >
              <option value="STUDENT">Student Report</option>
              <option value="SESSION">Trainer Session Report</option>
            </select>

            <button onClick={fetchHistory} style={btnStyle("#22d3ee")}>
              {historyLoading ? "Loading…" : "Search"}
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={btnStyle("#a78bfa")}
            >
              <Download size={13} style={{ marginRight: 5 }} />
              {downloading ? "Downloading…" : "Download Excel"}
            </button>
          </div>

          {historyError && (
            <div style={{ color: "#f87171", fontSize: 12 }}>{historyError}</div>
          )}

          {/* ANALYTICS SUMMARY */}
          {history?.analytics && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                fontSize: 12,
              }}
            >
              <span style={pill(theme)}>
                Total: {history.analytics.totalSessions}
              </span>
              <span style={pill(theme)}>
                Present: {history.analytics.presentCount}
              </span>
              <span style={pill(theme)}>
                Absent: {history.analytics.absentCount}
              </span>
              <span style={pill(theme)}>
                Late: {history.analytics.lateCount}
              </span>
              <span style={pill(theme)}>
                %: {history.analytics.attendancePercentage.toFixed(1)}%
              </span>
            </div>
          )}

          {/* RECORDS TABLE */}
          {history?.records && history.records.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left", color: theme.mu }}>
                    <th style={thStyle}>Batch</th>
                    <th style={thStyle}>Student</th>
                    <th style={thStyle}>Trainer</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.records.map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${theme.bd}` }}>
                      <td style={tdStyle}>{r.batchId}</td>
                      <td style={tdStyle}>{r.studentEmail}</td>
                      <td style={tdStyle}>{r.trainerEmail}</td>
                      <td style={tdStyle}>{r.attendanceDate}</td>
                      <td style={tdStyle}>
                        <StatusDot status={r.status} />
                        {r.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* BATCH LIST */}
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.bd}`,
            borderRadius: 20,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 22px",
              borderBottom: `1px solid ${theme.bd}`,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "rgba(34,211,238,.10)",
                color: "#22d3ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layers size={15} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Batches</span>
            <span style={{ fontSize: 11, color: theme.mu }}>
              ({overview.length})
            </span>
          </div>

          {loading ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: theme.mu,
                fontSize: 13,
              }}
            >
              Loading…
            </div>
          ) : error ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#f87171",
                fontSize: 13,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <AlertCircle size={20} />
              {error}
            </div>
          ) : overview.length === 0 ? (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                color: theme.mu,
                fontSize: 13,
              }}
            >
              No batches found for your organization.
            </div>
          ) : (
            overview.map((b) => {
              const isOpen = expandedBatchId === b.batchId;
              return (
                <div
                  key={b.batchId}
                  style={{ borderBottom: `1px solid ${theme.bd}` }}
                >
                  <div
                    onClick={() => toggleBatch(b.batchId)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 22px",
                      cursor: "pointer",
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = theme.rowHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {isOpen ? (
                      <ChevronDown size={15} color={theme.mu} />
                    ) : (
                      <ChevronRight size={15} color={theme.mu} />
                    )}
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: "rgba(167,139,250,.10)",
                        color: "#a78bfa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Layers size={15} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>
                        Batch #{b.batchId}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: theme.mu,
                          margin: "2px 0 0",
                        }}
                      >
                        {b.trainerEmail || "Unassigned"}
                      </p>
                    </div>
                    <span
                      style={{ fontSize: 11, color: theme.mu, flexShrink: 0 }}
                    >
                      {b.studentCount} students
                    </span>
                    <span
                      style={{ fontSize: 11, color: theme.mu, flexShrink: 0 }}
                    >
                      {b.sessionsMarked} sessions
                    </span>
                  </div>

                  {isOpen && (
                    <div
                      style={{
                        padding: "0 22px 20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                      }}
                    >
                      {detailLoading ? (
                        <div
                          style={{
                            padding: "20px 0",
                            textAlign: "center",
                            color: theme.mu,
                            fontSize: 12,
                          }}
                        >
                          Loading detail…
                        </div>
                      ) : (
                        <>
                          {/* TRAINER SESSION ATTENDANCE */}
                          <div
                            style={{
                              background: dark
                                ? "rgba(255,255,255,0.02)"
                                : "#f8fafc",
                              border: `1px solid ${theme.bd}`,
                              borderRadius: 14,
                              padding: 16,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 10,
                              }}
                            >
                              <UserCheck size={14} color="#22d3ee" />
                              <span style={{ fontSize: 12, fontWeight: 700 }}>
                                Trainer Session Attendance
                              </span>
                            </div>
                            {(detail?.trainerAttendance || []).length === 0 ? (
                              <p
                                style={{
                                  fontSize: 12,
                                  color: theme.mu,
                                  margin: 0,
                                }}
                              >
                                No sessions marked yet.
                              </p>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 6,
                                }}
                              >
                                {detail.trainerAttendance.map((row) => (
                                  <div
                                    key={row.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: 12,
                                    }}
                                  >
                                    <StatusDot status={row.status} />
                                    <span
                                      style={{
                                        color: theme.text,
                                        fontWeight: 600,
                                        marginRight: 8,
                                      }}
                                    >
                                      {row.sessionDate}
                                    </span>
                                    <span style={{ color: theme.mu }}>
                                      {row.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* STUDENT ATTENDANCE */}
                          <div
                            style={{
                              background: dark
                                ? "rgba(255,255,255,0.02)"
                                : "#f8fafc",
                              border: `1px solid ${theme.bd}`,
                              borderRadius: 14,
                              padding: 16,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 10,
                              }}
                            >
                              <Users size={14} color="#a78bfa" />
                              <span style={{ fontSize: 12, fontWeight: 700 }}>
                                Student Attendance
                              </span>
                            </div>
                            {Object.keys(detail?.studentAttendance || {})
                              .length === 0 ? (
                              <p
                                style={{
                                  fontSize: 12,
                                  color: theme.mu,
                                  margin: 0,
                                }}
                              >
                                No student attendance recorded yet.
                              </p>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 12,
                                }}
                              >
                                {Object.entries(detail.studentAttendance).map(
                                  ([email, rows]) => (
                                    <div key={email}>
                                      <p
                                        style={{
                                          fontSize: 12,
                                          fontWeight: 600,
                                          margin: "0 0 4px",
                                        }}
                                      >
                                        {email}
                                      </p>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: 6,
                                        }}
                                      >
                                        {rows.map((r, i) => (
                                          <span
                                            key={i}
                                            style={{
                                              fontSize: 11,
                                              padding: "3px 9px",
                                              borderRadius: 8,
                                              background: dark
                                                ? "rgba(255,255,255,0.04)"
                                                : "#ffffff",
                                              border: `1px solid ${theme.bd}`,
                                              color: theme.mu,
                                            }}
                                          >
                                            <StatusDot status={r.status} />
                                            {r.attendanceDate}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
