import { useState, useEffect } from "react";
import attendanceService from "../../services/attendanceService";
import {
  ShieldAlert,
  Layers,
  Users,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  X,
  Filter,
  Download,
  BarChart3,
} from "lucide-react";

/* ─── theme tokens — identical to SuperAdminFeedback.jsx so both pages feel
   like one product ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    cardBgHov: "#161616",
    heroBg: "#0d0d14",
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
    emptyBorder: "rgba(255,255,255,0.07)",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    barBg: "rgba(255,255,255,0.05)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    liveColor: "#34d399",
    liveText: "#34d399",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    heroTitle: "#ffffff",
    heroSub: "rgba(255,255,255,0.38)",
    heroGrid: "rgba(255,255,255,0.03)",
    heroBadgeDot: "#fbbf24",
    heroBadgeText: "#fcd34d",
    heroBtnBg: "rgba(255,255,255,0.04)",
    heroBtnBorder: "rgba(255,255,255,0.09)",
    heroBtnColor: "rgba(255,255,255,0.50)",
    heroStatBg: "rgba(255,255,255,0.04)",
    heroStatBorder: "rgba(255,255,255,0.08)",
    heroStatText: "rgba(255,255,255,0.42)",
    heroStatDiv: "rgba(255,255,255,0.10)",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.10)",
    inputText: "#ffffff",
    inputPlaceholder: "rgba(255,255,255,0.2)",
    modalBg: "#111111",
    modalBorder: "rgba(255,255,255,0.08)",
    toggleOff: "rgba(255,255,255,0.12)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
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
    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",
    barBg: "#f1f5f9",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    liveColor: "#16a34a",
    liveText: "#16a34a",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    heroTitle: "#0f172a",
    heroSub: "#64748b",
    heroGrid: "rgba(0,0,0,0.04)",
    heroBadgeDot: "#d97706",
    heroBadgeText: "#b45309",
    heroBtnBg: "#f8fafc",
    heroBtnBorder: "#e2e8f0",
    heroBtnColor: "#475569",
    heroStatBg: "#f8fafc",
    heroStatBorder: "#e2e8f0",
    heroStatText: "#64748b",
    heroStatDiv: "#e2e8f0",
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    inputText: "#0f172a",
    inputPlaceholder: "#94a3b8",
    modalBg: "#ffffff",
    modalBorder: "#e2e8f0",
    toggleOff: "#cbd5e1",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
  },
};

/* ─── NEW — small style helpers for the filter/report section ─── */
const labelStyle = (t) => ({
  display: "block",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: t.textLabel,
  marginBottom: 5,
  fontFamily: "'Poppins',sans-serif",
});

const inputStyle = (t) => ({
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: `1px solid ${t.inputBorder}`,
  background: t.inputBg,
  color: t.inputText,
  fontSize: 12,
  fontFamily: "'Poppins',sans-serif",
  outline: "none",
  boxSizing: "border-box",
});

const primaryBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 16px",
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(135deg,#f59e0b,#ef4444)",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "'Poppins',sans-serif",
};

const secondaryBtnStyle = (t) => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 16px",
  borderRadius: 10,
  border: `1px solid ${t.border}`,
  background: t.actBg,
  color: t.text,
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "'Poppins',sans-serif",
});

function Pill({ t, children, color }) {
  const style = color
    ? { background: `${color}15`, border: `1px solid ${color}30`, color }
    : {
        background: t.pillBg,
        border: `1px solid ${t.pillBorder}`,
        color: t.pillText,
      };
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "4px 10px",
        borderRadius: 999,
        fontFamily: "'Poppins',sans-serif",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function StatCard({ label, value, color, icon: Icon, sub, t }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: 20,
        padding: "18px 20px",
        boxShadow: t.shadow,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: color,
          filter: "blur(34px)",
          opacity: 0.08,
        }}
      />
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}18`,
          border: `1px solid ${color}30`,
          marginBottom: 12,
        }}
      >
        <Icon size={15} color={color} strokeWidth={2} />
      </div>
      <p
        style={{
          fontSize: 30,
          fontWeight: 800,
          lineHeight: 1,
          fontFamily: "'Poppins',sans-serif",
          color: t.text,
          margin: 0,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: 10,
          marginTop: 6,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: t.textMuted,
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        {label}
      </p>
      {sub && (
        <p
          style={{
            fontSize: 10,
            color: t.heroSub,
            margin: "6px 0 0",
            fontFamily: "'Poppins',sans-serif",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function Modal({ t, title, onClose, children, maxWidth = 560 }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: t.modalBg,
          border: `1px solid ${t.modalBorder}`,
          borderRadius: 20,
          padding: 24,
          maxWidth,
          width: "92%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: t.shadowHov,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: t.text,
              margin: 0,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: `1px solid ${t.border}`,
              background: t.actBg,
              color: t.textMuted,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const c =
    status === "PRESENT"
      ? "#34d399"
      : status === "ABSENT"
        ? "#f87171"
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

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT — attendance for batches with NO organization
══════════════════════════════════════════════════════ */
export default function SuperAdminAttendance() {
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

  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedForModal, setSelectedForModal] = useState(null);

  // ─── NEW — Reports & Analytics state (superadmin/history + superadmin/download) ───
  const [filterType, setFilterType] = useState("LAST_7_DAYS");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterBatchId, setFilterBatchId] = useState("");
  const [filterTrainerEmail, setFilterTrainerEmail] = useState("");
  const [filterStudentEmail, setFilterStudentEmail] = useState("");
  const [reportType, setReportType] = useState("STUDENT"); // STUDENT | SESSION — download only
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setLoading(true);
    attendanceService
      .getSuperAdminAttendanceOverview()
      .then((r) => setOverview(r.data || []))
      .catch(() => setError("Failed to load attendance overview."))
      .finally(() => setLoading(false));
  }, []);

  // const toggleBatch = async (batchId) => {
  //   if (expandedBatchId === batchId) {
  //     setExpandedBatchId(null);
  //     setDetail(null);
  //     return;
  //   }
  //   setExpandedBatchId(batchId);
  //   setDetail(null);
  //   setDetailLoading(true);
  //   try {
  //     const r = await attendanceService.getSuperAdminBatchAttendance(batchId);
  //     setDetail(r.data);
  //   } catch {
  //     setDetail({ trainerAttendance: [], studentAttendance: {} });
  //   } finally {
  //     setDetailLoading(false);
  //   }
  // };
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
      const r = await attendanceService.getSuperAdminBatchAttendance(batchId, {
        filterType,
        startDate: filterType === "CUSTOM" ? startDate : undefined,
        endDate: filterType === "CUSTOM" ? endDate : undefined,
      });
      setDetail(r.data);
    } catch {
      setDetail({ trainerAttendance: [], studentAttendance: {} });
    } finally {
      setDetailLoading(false);
    }
  };

  // NEW — if a batch is already expanded, refetch its detail whenever the filter changes
  useEffect(() => {
    if (expandedBatchId == null) return;

    setDetailLoading(true);
    attendanceService
      .getSuperAdminBatchAttendance(expandedBatchId, {
        filterType,
        startDate: filterType === "CUSTOM" ? startDate : undefined,
        endDate: filterType === "CUSTOM" ? endDate : undefined,
      })
      .then((r) => setDetail(r.data))
      .catch(() => setDetail({ trainerAttendance: [], studentAttendance: {} }))
      .finally(() => setDetailLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, startDate, endDate]);

  // ─── NEW — fetch filtered history + analytics from /superadmin/history ───
  const fetchHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const r = await attendanceService.getSuperAdminHistory({
        filterType,
        startDate: filterType === "CUSTOM" ? startDate : undefined,
        endDate: filterType === "CUSTOM" ? endDate : undefined,
        batchId: filterBatchId || undefined,
        trainerEmail: filterTrainerEmail || undefined,
        studentEmail: filterStudentEmail || undefined,
      });
      setHistoryData(r.data);
    } catch {
      setHistoryError("Failed to load attendance history.");
      setHistoryData(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ─── NEW — trigger Excel download from /superadmin/download ───
  const handleDownload = async () => {
    setDownloading(true);
    setHistoryError(null);
    try {
      const r = await attendanceService.downloadSuperAdminReport({
        filterType,
        startDate: filterType === "CUSTOM" ? startDate : undefined,
        endDate: filterType === "CUSTOM" ? endDate : undefined,
        batchId: filterBatchId || undefined,
        trainerEmail: filterTrainerEmail || undefined,
        studentEmail: filterStudentEmail || undefined,
        type: reportType,
      });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "superadmin-attendance-report.xlsx");
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: t.pageBg,
          color: t.text,
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        <div
          style={{
            padding: 24,
            maxWidth: 1300,
            margin: "0 auto",
            paddingBottom: 52,
          }}
        >
          {/* HERO */}
          <div
            style={{
              borderRadius: 16,
              padding: "18px 24px",
              background: t.heroBg,
              border: `1px solid ${t.borderHero}`,
              marginBottom: 14,
              boxShadow: t.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: t.heroBadgeDot,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: t.heroBadgeText,
                }}
              >
                Super Admin · Unassigned Batches
              </span>
            </div>
            <h1
              style={{
                fontWeight: 900,
                fontSize: "clamp(1.3rem,2.5vw,1.9rem)",
                color: t.heroTitle,
                margin: "0 0 3px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Attendance{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#f59e0b,#ef4444)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Review
              </span>
            </h1>
            <p
              style={{
                fontSize: 11,
                color: t.heroSub,
                margin: 0,
                fontWeight: 500,
              }}
            >
              Batches with no organization are handled here. Org-owned batches
              stay with their Org Admin.
            </p>
          </div>

          {/* STAT CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            <StatCard
              label="Unassigned Batches"
              value={overview.length}
              color="#f59e0b"
              icon={ShieldAlert}
              sub="No organization attached"
              t={t}
            />
            <StatCard
              label="Sessions Marked"
              value={totalSessions}
              color="#22d3ee"
              icon={CalendarCheck}
              sub="Trainer self-marked sessions"
              t={t}
            />
            <StatCard
              label="Students Tracked"
              value={totalStudents}
              color="#a78bfa"
              icon={Users}
              sub="Across unassigned batches"
              t={t}
            />
          </div>

          {/* ═══════════════ NEW — REPORTS & ANALYTICS ═══════════════ */}
          <div
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: 20,
              boxShadow: t.shadow,
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "18px 20px",
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(34,211,238,0.12)",
                  border: "1px solid rgba(34,211,238,0.3)",
                }}
              >
                <BarChart3 size={15} color="#22d3ee" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, color: t.text }}>
                Reports & Analytics
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  color: t.textMuted,
                }}
              >
                Orgless batches only
              </span>
            </div>

            <div style={{ padding: 20 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <div>
                  <label style={labelStyle(t)}>Filter</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={inputStyle(t)}
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
                </div>

                {filterType === "CUSTOM" && (
                  <>
                    <div>
                      <label style={labelStyle(t)}>Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={inputStyle(t)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle(t)}>End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={inputStyle(t)}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label style={labelStyle(t)}>Batch ID</label>
                  <input
                    type="number"
                    placeholder="Any"
                    value={filterBatchId}
                    onChange={(e) => setFilterBatchId(e.target.value)}
                    style={inputStyle(t)}
                  />
                </div>

                <div>
                  <label style={labelStyle(t)}>Trainer Email</label>
                  <input
                    type="text"
                    placeholder="Any"
                    value={filterTrainerEmail}
                    onChange={(e) => setFilterTrainerEmail(e.target.value)}
                    style={inputStyle(t)}
                  />
                </div>

                <div>
                  <label style={labelStyle(t)}>Student Email</label>
                  <input
                    type="text"
                    placeholder="Any"
                    value={filterStudentEmail}
                    onChange={(e) => setFilterStudentEmail(e.target.value)}
                    style={inputStyle(t)}
                  />
                </div>

                <div>
                  <label style={labelStyle(t)}>Report Type (download)</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    style={inputStyle(t)}
                  >
                    <option value="STUDENT">Student Attendance</option>
                    <option value="SESSION">Trainer Session Attendance</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 18,
                  flexWrap: "wrap",
                }}
              >
                <button onClick={fetchHistory} style={primaryBtnStyle}>
                  <Filter size={13} /> Apply Filters
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  style={{
                    ...secondaryBtnStyle(t),
                    opacity: downloading ? 0.6 : 1,
                    cursor: downloading ? "not-allowed" : "pointer",
                  }}
                >
                  <Download size={13} />{" "}
                  {downloading ? "Preparing…" : "Download Excel"}
                </button>
              </div>

              {historyError && (
                <p style={{ fontSize: 12, color: "#f87171", marginBottom: 12 }}>
                  {historyError}
                </p>
              )}

              {historyData?.analytics && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
                    gap: 12,
                    marginBottom: 18,
                  }}
                >
                  <StatCard
                    label="Total Sessions"
                    value={historyData.analytics.total ?? 0}
                    color="#22d3ee"
                    icon={CalendarCheck}
                    t={t}
                  />
                  <StatCard
                    label="Present"
                    value={historyData.analytics.present ?? 0}
                    color="#34d399"
                    icon={CalendarCheck}
                    t={t}
                  />
                  <StatCard
                    label="Absent"
                    value={historyData.analytics.absent ?? 0}
                    color="#f87171"
                    icon={CalendarCheck}
                    t={t}
                  />
                  <StatCard
                    label="Late"
                    value={historyData.analytics.late ?? 0}
                    color="#f59e0b"
                    icon={CalendarCheck}
                    t={t}
                  />
                  <StatCard
                    label="Attendance %"
                    value={`${(historyData.analytics.pct ?? 0).toFixed(1)}%`}
                    color="#a78bfa"
                    icon={CalendarCheck}
                    t={t}
                  />
                </div>
              )}

              {historyLoading ? (
                <div
                  style={{
                    padding: "20px 0",
                    textAlign: "center",
                    color: t.textMuted,
                    fontSize: 12,
                  }}
                >
                  Loading history…
                </div>
              ) : historyData?.records?.length ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {historyData.records.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 12,
                        padding: "8px 12px",
                        borderRadius: 10,
                        background: t.recentItemBg,
                        border: `1px solid ${t.recentItemBorder}`,
                        flexWrap: "wrap",
                      }}
                    >
                      <StatusDot status={r.status} />
                      <span style={{ color: t.text, fontWeight: 600 }}>
                        {r.attendanceDate}
                      </span>
                      <span style={{ color: t.textSub }}>
                        Batch #{r.batchId}
                      </span>
                      <span style={{ color: t.textSub }}>{r.studentEmail}</span>
                      <span style={{ color: t.textMuted }}>
                        trainer: {r.trainerEmail}
                      </span>
                      <span style={{ marginLeft: "auto", color: t.textSub }}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 12, color: t.textMuted, margin: 0 }}>
                  No records yet. Apply filters to load attendance history.
                </p>
              )}
            </div>
          </div>

          {/* BATCH LIST */}
          <div
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: 20,
              boxShadow: t.shadow,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "18px 20px",
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(245,158,11,0.12)",
                  border: "1px solid rgba(245,158,11,0.3)",
                }}
              >
                <Layers size={15} color="#f59e0b" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, color: t.text }}>
                Unassigned Batches
              </span>
              <Pill t={t}>{overview.length} total</Pill>
            </div>

            {loading ? (
              <div
                style={{
                  padding: "40px 0",
                  textAlign: "center",
                  color: t.textMuted,
                  fontSize: 12,
                }}
              >
                Loading…
              </div>
            ) : error ? (
              <div
                style={{
                  padding: "40px 0",
                  textAlign: "center",
                  color: "#f87171",
                  fontSize: 12,
                }}
              >
                {error}
              </div>
            ) : overview.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "40px 0",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1.5px dashed ${t.emptyBorder}`,
                    background: t.emptyBg,
                  }}
                >
                  <ShieldAlert size={20} color={t.emptyIcon} />
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: t.textMuted,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  No unassigned batches found
                </p>
              </div>
            ) : (
              overview.map((b) => {
                const isOpen = expandedBatchId === b.batchId;
                return (
                  <div
                    key={b.batchId}
                    style={{ borderBottom: `1px solid ${t.border}` }}
                  >
                    <div
                      onClick={() => toggleBatch(b.batchId)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 20px",
                        cursor: "pointer",
                      }}
                    >
                      {isOpen ? (
                        <ChevronDown size={15} color={t.textMuted} />
                      ) : (
                        <ChevronRight size={15} color={t.textMuted} />
                      )}
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          background: "rgba(245,158,11,0.12)",
                          color: "#f59e0b",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Layers size={15} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: t.text,
                            margin: 0,
                          }}
                        >
                          Batch #{b.batchId}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: t.textSub,
                            margin: "2px 0 0",
                          }}
                        >
                          {b.trainerEmail || "Unassigned"}
                        </p>
                      </div>
                      <Pill t={t}>{b.studentCount} students</Pill>
                      <Pill t={t} color="#22d3ee">
                        {b.sessionsMarked} sessions
                      </Pill>
                    </div>

                    {isOpen && (
                      <div
                        style={{
                          padding: "0 20px 20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 14,
                        }}
                      >
                        {detailLoading ? (
                          <div
                            style={{
                              padding: "16px 0",
                              textAlign: "center",
                              color: t.textMuted,
                              fontSize: 12,
                            }}
                          >
                            Loading detail…
                          </div>
                        ) : (
                          <>
                            <div
                              style={{
                                background: t.recentItemBg,
                                border: `1px solid ${t.recentItemBorder}`,
                                borderRadius: 12,
                                padding: 14,
                              }}
                            >
                              <p
                                style={{
                                  fontSize: 9,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.1em",
                                  color: t.textLabel,
                                  margin: "0 0 10px",
                                }}
                              >
                                Trainer Session Attendance
                              </p>
                              {(detail?.trainerAttendance || []).length ===
                              0 ? (
                                <p
                                  style={{
                                    fontSize: 12,
                                    color: t.textMuted,
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
                                          color: t.text,
                                          fontWeight: 600,
                                          marginRight: 8,
                                        }}
                                      >
                                        {row.sessionDate}
                                      </span>
                                      <span style={{ color: t.textSub }}>
                                        {row.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div
                              style={{
                                background: t.recentItemBg,
                                border: `1px solid ${t.recentItemBorder}`,
                                borderRadius: 12,
                                padding: 14,
                              }}
                            >
                              <p
                                style={{
                                  fontSize: 9,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.1em",
                                  color: t.textLabel,
                                  margin: "0 0 10px",
                                }}
                              >
                                Student Attendance
                              </p>
                              {Object.keys(detail?.studentAttendance || {})
                                .length === 0 ? (
                                <p
                                  style={{
                                    fontSize: 12,
                                    color: t.textMuted,
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
                                            color: t.text,
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
                                                background: t.pillBg,
                                                border: `1px solid ${t.pillBorder}`,
                                                color: t.textSub,
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

      {selectedForModal && (
        <Modal t={t} title="Detail" onClose={() => setSelectedForModal(null)}>
          <p style={{ fontSize: 12, color: t.textSub }}>
            Reserved for future drill-down.
          </p>
        </Modal>
      )}
    </>
  );
}
