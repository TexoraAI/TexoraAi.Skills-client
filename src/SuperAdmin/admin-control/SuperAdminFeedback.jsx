import { useState, useEffect } from "react";
import {
  getSuperAdminOrglessBatchIds,
  getSuperAdminFeedback,
  getSuperAdminBatchFeedback,
  updateSuperAdminFeedbackStatus,
  createOrUpdateSuperAdminAlertConfig,
  getSuperAdminAlertConfig,
  deleteSuperAdminAlertConfig,
} from "../../services/chatService";
import {
  AlertCircle,
  Bell,
  BookOpen,
  CheckCircle,
  Archive,
  Flag,
  Filter,
  Search,
  Shield,
  ShieldAlert,
  Star,
  Tag,
  Trash2,
  Users,
  X,
  Layers,
} from "lucide-react";

/* ─── theme tokens — kept identical to AdminFeedback.jsx so both pages feel
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

const DEFAULT_TRAINER_MSG =
  "Dear Trainer, your recent session ratings have dropped. Please focus on clarity and student engagement to improve your performance.";
const DEFAULT_STUDENT_MSG =
  "Dear Student, we have received your feedback and are actively working to resolve your concerns. Improvements are on the way!";
const DEFAULT_ADMIN_MSG =
  "Alert: Feedback ratings for this unassigned batch require your attention as Super Admin.";

const moodEmoji = {
  AMAZING: "🤩",
  GOOD: "😊",
  FINE: "🙂",
  OKAY: "😐",
  POOR: "😞",
};
const TAG_COLORS = [
  {
    bg: "rgba(34,211,238,0.1)",
    color: "#22d3ee",
    border: "rgba(34,211,238,0.25)",
  },
  {
    bg: "rgba(167,139,250,0.1)",
    color: "#a78bfa",
    border: "rgba(167,139,250,0.25)",
  },
  {
    bg: "rgba(52,211,153,0.1)",
    color: "#34d399",
    border: "rgba(52,211,153,0.25)",
  },
  {
    bg: "rgba(251,146,60,0.1)",
    color: "#fb923c",
    border: "rgba(251,146,60,0.25)",
  },
];

function avg(f) {
  return ((f.clarity + f.doubt + f.energy + f.depth) / 4).toFixed(1);
}
function ratingColor(v) {
  return v >= 4 ? "#34d399" : v >= 3 ? "#f59e0b" : "#f87171";
}

function normalize(f) {
  return {
    id: f.id,
    batchId: f.batchId,
    student: f.studentEmail || "Anonymous",
    trainer: f.trainerEmail || "N/A",
    batch: `Batch ${f.batchId}`,
    clarity: f.trainerClarityRating || 0,
    doubt: f.trainerDoubtClearingRating || 0,
    energy: f.trainerEnergyRating || 0,
    depth: f.trainerTechnicalDepthRating || 0,
    mood: moodEmoji[f.moodRating] || "😐",
    tags: f.contentTags || [],
    comment: f.comment || "",
    status: f.status,
    date: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "—",
  };
}

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

function Toggle({ checked, onChange, t }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        width: 40,
        height: 22,
        borderRadius: 11,
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        background: checked ? "#f59e0b" : t.toggleOff,
        transition: "background 0.25s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          left: checked ? 21 : 3,
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    SUBMITTED: {
      bg: "rgba(99,102,241,0.12)",
      color: "#a78bfa",
      border: "rgba(99,102,241,0.25)",
    },
    REVIEWED: {
      bg: "rgba(52,211,153,0.12)",
      color: "#34d399",
      border: "rgba(52,211,153,0.25)",
    },
    ARCHIVED: {
      bg: "rgba(245,158,11,0.12)",
      color: "#f59e0b",
      border: "rgba(245,158,11,0.25)",
    },
  };
  const s = map[status] || map.SUBMITTED;
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "3px 9px",
        borderRadius: 999,
        fontFamily: "'Poppins',sans-serif",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {status}
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

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT — feedback for batches with NO organization
══════════════════════════════════════════════════════ */
export default function SuperAdminFeedback() {
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

  const [batchIds, setBatchIds] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("all"); // "all" = every orgless batch
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [alertModal, setAlertModal] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertSaving, setAlertSaving] = useState(false);
  const [alertSaveMsg, setAlertSaveMsg] = useState(null);
  const [alertBatchId, setAlertBatchId] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    trainerEmail: "",
    sendToTrainer: true,
    sendToStudent: false,
    sendToAdmin: true,
    alertLowRatings: true,
    lowRatingThreshold: 3.0,
    trainerMessage: DEFAULT_TRAINER_MSG,
    studentMessage: DEFAULT_STUDENT_MSG,
    adminMessage: DEFAULT_ADMIN_MSG,
  });

  useEffect(() => {
    getSuperAdminOrglessBatchIds()
      .then((r) => setBatchIds(Array.isArray(r.data) ? r.data : []))
      .catch(() => setBatchIds([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const req =
      selectedBatchId === "all"
        ? getSuperAdminFeedback()
        : getSuperAdminBatchFeedback(selectedBatchId);
    req
      .then((r) => setFeedbackList((r.data || []).map(normalize)))
      .catch(() => setFeedbackList([]))
      .finally(() => setLoading(false));
  }, [selectedBatchId]);

  function openAlertModal(batchId) {
    if (!batchId || batchId === "all") return; // alerts are configured per-batch
    setAlertBatchId(batchId);
    setAlertModal(true);
    setAlertSaveMsg(null);
    setAlertLoading(true);
    getSuperAdminAlertConfig(batchId)
      .then((r) => {
        if (r.data) {
          setAlertConfig({
            trainerEmail: r.data.trainerEmail || "",
            sendToTrainer: r.data.sendToTrainer ?? true,
            sendToStudent: r.data.sendToStudent ?? false,
            sendToAdmin: r.data.sendToAdmin ?? true,
            alertLowRatings: r.data.alertLowRatings ?? true,
            lowRatingThreshold: r.data.lowRatingThreshold ?? 3.0,
            trainerMessage: r.data.trainerMessage || DEFAULT_TRAINER_MSG,
            studentMessage: r.data.studentMessage || DEFAULT_STUDENT_MSG,
            adminMessage: r.data.adminMessage || DEFAULT_ADMIN_MSG,
          });
        }
      })
      .catch(() => {})
      .finally(() => setAlertLoading(false));
  }

  async function saveAlertConfig() {
    if (!alertBatchId) return;
    setAlertSaving(true);
    setAlertSaveMsg(null);
    try {
      await createOrUpdateSuperAdminAlertConfig({
        batchId: alertBatchId,
        trainerEmail: alertConfig.trainerEmail,
        sendToTrainer: alertConfig.sendToTrainer,
        sendToStudent: alertConfig.sendToStudent,
        sendToAdmin: alertConfig.sendToAdmin,
        alertLowRatings: alertConfig.alertLowRatings,
        lowRatingThreshold: parseFloat(alertConfig.lowRatingThreshold),
        trainerMessage: alertConfig.trainerMessage,
        studentMessage: alertConfig.studentMessage,
        adminMessage: alertConfig.adminMessage,
      });
      setAlertSaveMsg({
        type: "success",
        text: "Alert config saved successfully.",
      });
    } catch {
      setAlertSaveMsg({
        type: "error",
        text: "Failed to save. Please try again.",
      });
    } finally {
      setAlertSaving(false);
    }
  }

  async function handleDeleteAlertConfig() {
    if (!alertBatchId) return;
    if (!window.confirm("Delete alert config for this batch?")) return;
    try {
      await deleteSuperAdminAlertConfig(alertBatchId);
      setAlertSaveMsg({ type: "success", text: "Alert config deleted." });
    } catch {
      setAlertSaveMsg({ type: "error", text: "Failed to delete." });
    }
  }

  async function adminAction(type) {
    if (!selected) return;
    const status = type === "reviewed" ? "REVIEWED" : "ARCHIVED";
    try {
      await updateSuperAdminFeedbackStatus(selected.id, status);
    } catch {}
    setFeedbackList((prev) =>
      prev.map((x) => (x.id === selected.id ? { ...x, status } : x)),
    );
    setSelected(null);
  }

  const filtered = feedbackList.filter((f) => {
    const mf =
      filter === "all"
        ? true
        : filter === "new"
          ? f.status === "SUBMITTED"
          : filter === "reviewed"
            ? f.status === "REVIEWED"
            : filter === "flag"
              ? parseFloat(avg(f)) < 3.5
              : true;
    const ms = ((f.student || "") + (f.batch || "") + (f.trainer || ""))
      .toLowerCase()
      .includes(search.toLowerCase());
    return mf && ms;
  });

  const platAvg = feedbackList.length
    ? (
        feedbackList.reduce((s, f) => s + parseFloat(avg(f)), 0) /
        feedbackList.length
      ).toFixed(1)
    : "—";
  const needsAttn = feedbackList.filter((f) => parseFloat(avg(f)) < 3.0).length;

  const inp = {
    background: t.inputBg,
    border: `1px solid ${t.inputBorder}`,
    color: t.inputText,
    borderRadius: 10,
    padding: "9px 12px",
    fontSize: 12,
    fontFamily: "'Poppins',sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const recipientRows = [
    {
      key: "sendToTrainer",
      label: "Notify Trainer",
      sub: "Send alert to the trainer of this batch",
      msgKey: "trainerMessage",
      icon: Users,
      color: "#22d3ee",
    },
    {
      key: "sendToStudent",
      label: "Notify Students",
      sub: "Send alert to students in this batch",
      msgKey: "studentMessage",
      icon: BookOpen,
      color: "#34d399",
    },
    {
      key: "sendToAdmin",
      label: "Notify Super Admin",
      sub: "Send alert to all Super Admin users",
      msgKey: "adminMessage",
      icon: Shield,
      color: "#a78bfa",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        input:focus,textarea:focus,select:focus{border-color:#f59e0b !important;outline:none;}
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
          {/* ═══ HERO ═══ */}
          <div
            style={{
              borderRadius: 16,
              padding: "18px 24px",
              background: t.heroBg,
              border: `1px solid ${t.borderHero}`,
              marginBottom: 14,
              boxShadow: t.shadow,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flex: "1 1 auto",
                  minWidth: 0,
                }}
              >
                <div>
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
                    Feedback{" "}
                    <span
                      style={{
                        background: "linear-gradient(135deg,#f59e0b,#ef4444)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Escalation
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
                    Batches with no organization are handled here. Org-owned
                    batches stay with their Org Admin.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: t.heroStatBg,
                      border: `1px solid ${t.heroStatBorder}`,
                      borderRadius: 10,
                      padding: "6px 12px",
                    }}
                  >
                    <Layers size={11} color={t.heroBadgeText} />
                    <select
                      value={selectedBatchId}
                      onChange={(e) => setSelectedBatchId(e.target.value)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: t.text,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      <option value="all">All unassigned batches</option>
                      {batchIds.map((id) => (
                        <option key={id} value={id}>
                          Batch #{id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => openAlertModal(selectedBatchId)}
                    disabled={selectedBatchId === "all"}
                    title={
                      selectedBatchId === "all"
                        ? "Pick a specific batch to configure its alerts"
                        : ""
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      border: "none",
                      background:
                        selectedBatchId === "all"
                          ? t.toggleOff
                          : "linear-gradient(135deg,#f59e0b,#ef4444)",
                      color: selectedBatchId === "all" ? t.textMuted : "#fff",
                      cursor:
                        selectedBatchId === "all" ? "not-allowed" : "pointer",
                      boxShadow:
                        selectedBatchId === "all"
                          ? "none"
                          : "0 3px 10px rgba(245,158,11,0.35)",
                    }}
                  >
                    <Bell size={11} /> Configure Alerts
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: t.heroStatBg,
                    border: `1px solid ${t.heroStatBorder}`,
                    borderRadius: 10,
                    padding: "5px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: t.heroStatText,
                    width: "fit-content",
                  }}
                >
                  <span>{batchIds.length} unassigned batches</span>
                  <span
                    style={{ width: 1, height: 12, background: t.heroStatDiv }}
                  />
                  <span>{feedbackList.length} feedback entries</span>
                  <span
                    style={{ width: 1, height: 12, background: t.heroStatDiv }}
                  />
                  {needsAttn > 0 ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "#f87171",
                        fontWeight: 700,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#f87171",
                        }}
                      />
                      {needsAttn} need attention
                    </span>
                  ) : (
                    <span style={{ color: t.liveText, fontWeight: 700 }}>
                      All clear ✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ STAT CARDS ═══ */}
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
              value={batchIds.length}
              color="#f59e0b"
              icon={ShieldAlert}
              sub="No organization attached"
              t={t}
            />
            <StatCard
              label="Total Feedback"
              value={feedbackList.length}
              color="#6366f1"
              icon={Filter}
              sub="Across unassigned batches"
              t={t}
            />
            <StatCard
              label="Average Rating"
              value={platAvg}
              color="#34d399"
              icon={Star}
              sub="Unassigned batches only"
              t={t}
            />
            <StatCard
              label="Needs Attention"
              value={needsAttn}
              color="#f87171"
              icon={AlertCircle}
              sub="Ratings below 3.0"
              t={t}
            />
          </div>

          {/* ═══ FEEDBACK TABLE ═══ */}
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
                justifyContent: "space-between",
                padding: "18px 20px",
                borderBottom: `1px solid ${t.border}`,
                flexWrap: "wrap",
                gap: 12,
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
                    background: "rgba(245,158,11,0.12)",
                    border: "1px solid rgba(245,158,11,0.3)",
                  }}
                >
                  <Filter size={15} color="#f59e0b" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 13, color: t.text }}>
                  Unassigned Feedback
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Search
                    size={12}
                    color={t.textMuted}
                    style={{ position: "absolute", left: 10 }}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by student, batch, trainer..."
                    style={{ ...inp, paddingLeft: 30, width: 240 }}
                  />
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[
                    ["all", "All"],
                    ["new", "New"],
                    ["reviewed", "Reviewed"],
                    ["flag", "⚠ Low"],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setFilter(v)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                        border:
                          filter === v
                            ? "1px solid rgba(245,158,11,0.4)"
                            : `1px solid ${t.border}`,
                        background:
                          filter === v
                            ? "rgba(245,158,11,0.12)"
                            : "transparent",
                        color: filter === v ? "#f59e0b" : t.textMuted,
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr 1fr 1fr 80px 110px 70px 80px",
                gap: 8,
                padding: "10px 16px",
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              {[
                "Mood",
                "Batch",
                "Trainer",
                "Student",
                "Avg",
                "Status",
                "Date",
                "",
              ].map((h) => (
                <p
                  key={h}
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: t.textLabel,
                    margin: 0,
                  }}
                >
                  {h}
                </p>
              ))}
            </div>

            <div style={{ padding: "8px 4px" }}>
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
              ) : filtered.length === 0 ? (
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
                    No unassigned feedback found
                  </p>
                </div>
              ) : (
                filtered.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "40px 1fr 1fr 1fr 80px 110px 70px 80px",
                      alignItems: "center",
                      gap: 8,
                      padding: "11px 16px",
                      borderRadius: 12,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{f.mood}</span>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: t.text,
                        margin: 0,
                      }}
                    >
                      {f.batch}
                    </p>
                    <p style={{ fontSize: 11, color: t.textSub, margin: 0 }}>
                      {f.trainer}
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: t.textSub,
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.student}
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: ratingColor(parseFloat(avg(f))),
                        margin: 0,
                      }}
                    >
                      {avg(f)}
                    </p>
                    <div>
                      <StatusBadge status={f.status} />
                    </div>
                    <p style={{ fontSize: 10, color: t.textMuted, margin: 0 }}>
                      {f.date}
                    </p>
                    <button
                      onClick={() => setSelected(f)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 8,
                        border: `1px solid ${t.border}`,
                        background: t.pillBg,
                        color: t.textSub,
                        fontSize: 10,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      View →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FEEDBACK DETAIL MODAL ═══ */}
      {selected && (
        <Modal
          t={t}
          title={`Feedback #${selected.id} — ${selected.batch}`}
          onClose={() => setSelected(null)}
          maxWidth={520}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 18,
            }}
          >
            {[
              ["Student", selected.student],
              ["Trainer", selected.trainer],
              ["Batch", selected.batch],
              ["Mood", selected.mood],
              ["Status", selected.status],
              ["Date", selected.date],
              ["Overall Avg", `${avg(selected)} / 5.0`],
            ].map(([l, v]) => (
              <div
                key={l}
                style={{
                  background: t.recentItemBg,
                  border: `1px solid ${t.recentItemBorder}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: t.textLabel,
                    margin: "0 0 4px",
                  }}
                >
                  {l}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: t.text,
                    margin: 0,
                  }}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>
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
            Tags
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 16,
            }}
          >
            {(selected.tags || []).map((tag, i) => {
              const c = TAG_COLORS[i % TAG_COLORS.length];
              return (
                <span
                  key={tag}
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "4px 12px",
                    borderRadius: 999,
                    background: c.bg,
                    color: c.color,
                    border: `1px solid ${c.border}`,
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
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
            Comment
          </p>
          {selected.comment ? (
            <div
              style={{
                background: t.recentItemBg,
                border: `1px solid ${t.recentItemBorder}`,
                borderRadius: 12,
                padding: 14,
                fontSize: 12,
                color: t.textSub,
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              "{selected.comment}"
            </div>
          ) : (
            <p style={{ fontSize: 12, color: t.textMuted }}>
              No comment provided.
            </p>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button
              onClick={() => adminAction("reviewed")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: "rgba(52,211,153,0.15)",
                border: "1px solid rgba(52,211,153,0.4)",
                color: "#34d399",
              }}
            >
              <CheckCircle size={13} /> Mark Reviewed
            </button>
            <button
              onClick={() => adminAction("archive")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: "transparent",
                border: `1px solid ${t.border}`,
                color: t.textSub,
              }}
            >
              <Archive size={13} /> Archive
            </button>
            <button
              onClick={() => {
                openAlertModal(selected.batchId);
                setSelected(null);
              }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.4)",
                color: "#f59e0b",
              }}
            >
              <Flag size={13} /> Alert Trainer
            </button>
          </div>
        </Modal>
      )}

      {/* ═══ CONFIGURE ALERTS MODAL ═══ */}
      {alertModal && (
        <Modal
          t={t}
          title="Configure Alerts"
          onClose={() => setAlertModal(false)}
          maxWidth={560}
        >
          <p
            style={{ fontSize: 11, color: t.textMuted, margin: "-10px 0 16px" }}
          >
            Batch #{alertBatchId} · No organization
          </p>

          {alertSaveMsg && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                marginBottom: 16,
                fontSize: 11,
                fontWeight: 600,
                textAlign: "center",
                background:
                  alertSaveMsg.type === "success"
                    ? "rgba(52,211,153,0.1)"
                    : "rgba(248,113,113,0.1)",
                border: `1px solid ${alertSaveMsg.type === "success" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
                color: alertSaveMsg.type === "success" ? "#34d399" : "#f87171",
              }}
            >
              {alertSaveMsg.text}
            </div>
          )}

          {alertLoading ? (
            <div
              style={{
                padding: "20px 0",
                textAlign: "center",
                color: t.textMuted,
                fontSize: 12,
              }}
            >
              Loading…
            </div>
          ) : (
            <>
              <p
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: t.textLabel,
                  margin: "0 0 8px",
                }}
              >
                Trainer Email
              </p>
              <input
                value={alertConfig.trainerEmail}
                onChange={(e) =>
                  setAlertConfig((p) => ({
                    ...p,
                    trainerEmail: e.target.value,
                  }))
                }
                placeholder="trainer@example.com"
                style={{ ...inp, marginBottom: 20 }}
              />

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
                Notify Recipients
              </p>
              {recipientRows.map(
                ({ key, label, sub, msgKey, icon: Icon, color }) => (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "11px 14px",
                        borderRadius: 10,
                        background: t.recentItemBg,
                        border: `1px solid ${t.recentItemBorder}`,
                        marginBottom: alertConfig[key] ? 6 : 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: `${color}18`,
                            border: `1px solid ${color}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon size={13} color={color} />
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: t.text,
                              margin: 0,
                            }}
                          >
                            {label}
                          </p>
                          <p
                            style={{
                              fontSize: 10,
                              color: t.textMuted,
                              margin: "2px 0 0",
                            }}
                          >
                            {sub}
                          </p>
                        </div>
                      </div>
                      <Toggle
                        checked={alertConfig[key]}
                        onChange={(val) =>
                          setAlertConfig((p) => ({ ...p, [key]: val }))
                        }
                        t={t}
                      />
                    </div>
                    {alertConfig[key] && (
                      <textarea
                        rows={2}
                        value={alertConfig[msgKey]}
                        onChange={(e) =>
                          setAlertConfig((p) => ({
                            ...p,
                            [msgKey]: e.target.value,
                          }))
                        }
                        style={{
                          ...inp,
                          resize: "vertical",
                          lineHeight: 1.6,
                          padding: "9px 12px",
                        }}
                      />
                    )}
                  </div>
                ),
              )}

              <p
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: t.textLabel,
                  margin: "16px 0 10px",
                }}
              >
                Low Rating Alerts
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  borderRadius: 10,
                  background: t.recentItemBg,
                  border: `1px solid ${t.recentItemBorder}`,
                  marginBottom: 8,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: t.text,
                      margin: 0,
                    }}
                  >
                    Alert on Low Ratings
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: t.textMuted,
                      margin: "2px 0 0",
                    }}
                  >
                    Trigger alert when avg drops below threshold
                  </p>
                </div>
                <Toggle
                  checked={alertConfig.alertLowRatings}
                  onChange={(val) =>
                    setAlertConfig((p) => ({ ...p, alertLowRatings: val }))
                  }
                  t={t}
                />
              </div>
              {alertConfig.alertLowRatings && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    borderRadius: 10,
                    background: t.recentItemBg,
                    border: `1px solid ${t.recentItemBorder}`,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: t.text,
                        margin: 0,
                      }}
                    >
                      Low Rating Threshold
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: t.textMuted,
                        margin: "2px 0 0",
                      }}
                    >
                      Alert triggers below this value
                    </p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={alertConfig.lowRatingThreshold}
                    onChange={(e) =>
                      setAlertConfig((p) => ({
                        ...p,
                        lowRatingThreshold: e.target.value,
                      }))
                    }
                    style={{
                      width: 70,
                      padding: "8px 10px",
                      borderRadius: 9,
                      background: "rgba(245,158,11,0.1)",
                      border: "1.5px solid rgba(245,158,11,0.3)",
                      color: "#f59e0b",
                      fontSize: 13,
                      fontWeight: 700,
                      outline: "none",
                      textAlign: "center",
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 20,
                  alignItems: "center",
                }}
              >
                <button
                  onClick={saveAlertConfig}
                  disabled={alertSaving}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 10,
                    border: "none",
                    background: alertSaving
                      ? "rgba(245,158,11,0.3)"
                      : "linear-gradient(135deg,#f59e0b,#ef4444)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
                  }}
                >
                  {alertSaving ? "Saving..." : "Save Config"}
                </button>
                <button
                  onClick={() => setAlertModal(false)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 10,
                    border: `1px solid ${t.border}`,
                    background: t.actBg,
                    color: t.textSub,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAlertConfig}
                  style={{
                    padding: "11px 16px",
                    borderRadius: 10,
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.25)",
                    color: "#f87171",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
