import { useState, useEffect } from "react";
import {
  getBatchFeedback,
  getBatchSummaries,
  updateFeedbackStatus,
  createOrUpdateAlertConfig,
  getAlertConfig,
  deleteAlertConfig,
} from "../services/chatService";
import { getAllBatches } from "../services/batchService";
import {
  Activity,
  AlertCircle,
  Archive,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Download,
  Eye,
  Filter,
  Flag,
  Layers,
  Search,
  Shield,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

/* ─── theme token map (matches AdminDashboard exactly) ─── */
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
    actBar: "rgba(255,255,255,0.5)",
    actIcon: "rgba(255,255,255,0.3)",
    actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    liveColor: "#34d399",
    liveText: "#34d399",
    recentItemBg: "rgba(255,255,255,0.03)",
    recentItemBorder: "rgba(255,255,255,0.05)",
    recentItemBgHov: "rgba(255,255,255,0.06)",
    overdueBg: "rgba(239,68,68,0.12)",
    overdueText: "#f87171",
    overdueBorder: "rgba(239,68,68,0.2)",
    newBadgeBg: "rgba(245,158,11,0.12)",
    newBadgeText: "#fbbf24",
    newBadgeBorder: "rgba(245,158,11,0.2)",
    heroTitle: "#ffffff",
    heroSub: "rgba(255,255,255,0.38)",
    heroGrid: "rgba(255,255,255,0.03)",
    heroBadgeDot: "#818cf8",
    heroBadgeText: "#a5b4fc",
    heroBtnBg: "rgba(255,255,255,0.04)",
    heroBtnBorder: "rgba(255,255,255,0.09)",
    heroBtnColor: "rgba(255,255,255,0.50)",
    heroStatBg: "rgba(255,255,255,0.04)",
    heroStatBorder: "rgba(255,255,255,0.08)",
    heroStatText: "rgba(255,255,255,0.42)",
    heroStatDiv: "rgba(255,255,255,0.10)",
    heroActBg: "rgba(255,255,255,0.04)",
    heroActBorder: "rgba(255,255,255,0.08)",
    heroActBar: "rgba(255,255,255,0.40)",
    heroActIcon: "rgba(255,255,255,0.40)",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.10)",
    inputText: "#ffffff",
    inputPlaceholder: "rgba(255,255,255,0.2)",
    modalBg: "#111111",
    modalBorder: "rgba(255,255,255,0.08)",
    toggleOff: "rgba(255,255,255,0.12)",
    skeletonFrom: "rgba(255,255,255,0.04)",
    skeletonTo: "rgba(255,255,255,0.08)",
    gridLine: "rgba(255,255,255,0.03)",
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
    actBar: "#94a3b8",
    actIcon: "#94a3b8",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",
    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    liveColor: "#16a34a",
    liveText: "#16a34a",
    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",
    overdueBg: "#fef2f2",
    overdueText: "#ef4444",
    overdueBorder: "#fecaca",
    newBadgeBg: "#fffbeb",
    newBadgeText: "#d97706",
    newBadgeBorder: "#fde68a",
    heroTitle: "#0f172a",
    heroSub: "#64748b",
    heroGrid: "rgba(0,0,0,0.04)",
    heroBadgeDot: "#6366f1",
    heroBadgeText: "#4f46e5",
    heroBtnBg: "#f8fafc",
    heroBtnBorder: "#e2e8f0",
    heroBtnColor: "#475569",
    heroStatBg: "#f8fafc",
    heroStatBorder: "#e2e8f0",
    heroStatText: "#64748b",
    heroStatDiv: "#e2e8f0",
    heroActBg: "#f8fafc",
    heroActBorder: "#e2e8f0",
    heroActBar: "#94a3b8",
    heroActIcon: "#94a3b8",
    inputBg: "#f8fafc",
    inputBorder: "#e2e8f0",
    inputText: "#0f172a",
    inputPlaceholder: "#94a3b8",
    modalBg: "#ffffff",
    modalBorder: "#e2e8f0",
    toggleOff: "#cbd5e1",
    skeletonFrom: "#f1f5f9",
    skeletonTo: "#e2e8f0",
    gridLine: "rgba(0,0,0,0.04)",
  },
};

/* ─── mock data ─── */
const MOCK = [
  { id: 1, mood: "🤩", batch: "Java FS W6", trainer: "Anil Kumar", student: "Anonymous", clarity: 5, doubt: 4, energy: 5, depth: 4, tags: ["Just right", "Great demos"], comment: "Best session! Spring Boot deep dive was excellent.", status: "SUBMITTED", date: "Apr 15" },
  { id: 2, mood: "😊", batch: "Java FS W6", trainer: "Anil Kumar", student: "Priya M.", clarity: 4, doubt: 4, energy: 4, depth: 3, tags: ["Just right"], comment: "", status: "REVIEWED", date: "Apr 15" },
  { id: 3, mood: "😐", batch: "React W3", trainer: "Sneha R.", student: "Anonymous", clarity: 3, doubt: 2, energy: 3, depth: 3, tags: ["Too fast"], comment: "Needs to slow down during hooks.", status: "SUBMITTED", date: "Apr 14" },
  { id: 4, mood: "😞", batch: "DevOps W2", trainer: "Divya P.", student: "Anonymous", clarity: 2, doubt: 1, energy: 2, depth: 2, tags: ["Hard to follow", "Too fast"], comment: "Couldn't understand Kubernetes networking.", status: "SUBMITTED", date: "Apr 14" },
  { id: 5, mood: "🤩", batch: "React W3", trainer: "Sneha R.", student: "Ravi K.", clarity: 5, doubt: 5, energy: 5, depth: 5, tags: ["Just right", "Great demos"], comment: "Absolutely loved it!", status: "REVIEWED", date: "Apr 13" },
  { id: 6, mood: "😊", batch: "Spring W4", trainer: "Karthik M.", student: "Anonymous", clarity: 4, doubt: 3, energy: 4, depth: 4, tags: ["Notes & resources"], comment: "Please share slides.", status: "SUBMITTED", date: "Apr 13" },
];

const DEFAULT_TRAINER_MSG = "Dear Trainer, your recent session ratings have dropped. Please focus on clarity and student engagement to improve your performance.";
const DEFAULT_STUDENT_MSG = "Dear Student, we have received your feedback and are actively working to resolve your concerns. Improvements are on the way!";
const DEFAULT_ADMIN_MSG = "Alert: Feedback ratings for this batch require your attention. Please review the dashboard for details.";

const moodEmoji = { AMAZING: "🤩", GOOD: "😊", FINE: "🙂", OKAY: "😐", POOR: "😞" };

const GRAD = [
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  "linear-gradient(135deg,#22d3ee,#0891b2)",
  "linear-gradient(135deg,#f43f5e,#be123c)",
];

const TAG_COLORS = [
  { bg: "rgba(34,211,238,0.1)", color: "#22d3ee", border: "rgba(34,211,238,0.25)" },
  { bg: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "rgba(167,139,250,0.25)" },
  { bg: "rgba(52,211,153,0.1)", color: "#34d399", border: "rgba(52,211,153,0.25)" },
  { bg: "rgba(251,146,60,0.1)", color: "#fb923c", border: "rgba(251,146,60,0.25)" },
  { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.25)" },
];

function avg(f) {
  return ((f.clarity + f.doubt + f.energy + f.depth) / 4).toFixed(1);
}

function ratingColor(v) {
  return v >= 4 ? "#34d399" : v >= 3 ? "#f59e0b" : "#f87171";
}

/* ─── Reusable Components ─── */

function IconBox({ color, icon: Icon, size = 15 }) {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: `${color}18`, border: `1px solid ${color}30`,
    }}>
      <Icon size={size} color={color} strokeWidth={2} />
    </div>
  );
}

function Pill({ t, children, color }) {
  if (color) {
    return (
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
        padding: "4px 10px", borderRadius: 999, fontFamily: "'Poppins',sans-serif",
        background: `${color}15`, border: `1px solid ${color}30`, color,
      }}>{children}</span>
    );
  }
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "4px 10px", borderRadius: 999, background: t.pillBg,
      border: `1px solid ${t.pillBorder}`, color: t.pillText, fontFamily: "'Poppins',sans-serif",
    }}>{children}</span>
  );
}

function Toggle({ checked, onChange, t }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        position: "relative", width: 40, height: 22, borderRadius: 11,
        border: "none", cursor: "pointer", flexShrink: 0,
        background: checked ? "#6366f1" : t.toggleOff,
        transition: "background 0.25s",
      }}
    >
      <span style={{
        position: "absolute", top: 3, width: 16, height: 16, borderRadius: "50%",
        background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        left: checked ? 21 : 3, transition: "left 0.2s",
      }} />
    </button>
  );
}

function SkeletonRow({ t }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: t.barBg, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ height: 10, borderRadius: 5, background: t.barBg, width: "60%" }} />
        <div style={{ height: 8, borderRadius: 4, background: t.barBg, width: "40%" }} />
      </div>
    </div>
  );
}

function StatusBadge({ status, t }) {
  const map = {
    SUBMITTED: { bg: "rgba(99,102,241,0.12)", color: "#a78bfa", border: "rgba(99,102,241,0.25)" },
    REVIEWED:  { bg: "rgba(52,211,153,0.12)", color: "#34d399", border: "rgba(52,211,153,0.25)" },
    ARCHIVED:  { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "rgba(245,158,11,0.25)" },
  };
  const s = map[status] || map.SUBMITTED;
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 999, fontFamily: "'Poppins',sans-serif",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{status}</span>
  );
}

function RatingBar({ label, val, t }) {
  const color = ratingColor(val);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
      <span style={{ fontSize: 11, color: t.textMuted, width: 130, flexShrink: 0, fontFamily: "'Poppins',sans-serif" }}>{label}</span>
      <div style={{ flex: 1, height: 6, borderRadius: 4, background: t.barBg, overflow: "hidden" }}>
        <div style={{ width: `${(val / 5) * 100}%`, height: 6, borderRadius: 4, background: color, boxShadow: `0 0 8px ${color}60`, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, width: 36, textAlign: "right", fontFamily: "'Poppins',sans-serif" }}>{val}/5</span>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ label, value, delta, up, fillPct, color, icon: Icon, t }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? t.cardBgHov : t.cardBg,
        border: `1px solid ${hov ? t.borderHov : t.border}`,
        borderRadius: 20, padding: "20px 20px 18px",
        boxShadow: hov ? t.shadowHov : t.shadow,
        transition: "all 0.25s ease",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", gap: 12,
      }}
    >
      <div style={{
        position: "absolute", top: -20, right: -20, width: 80, height: 80,
        borderRadius: "50%", background: color, filter: "blur(36px)",
        opacity: hov ? 0.18 : 0.05, transition: "opacity 0.4s", pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${color}18`, border: `1px solid ${color}30`,
        }}>
          <Icon size={17} color={color} strokeWidth={2} />
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "3px 9px", borderRadius: 999, background: t.pillBg,
          border: `1px solid ${t.pillBorder}`, color: t.pillText, fontFamily: "'Poppins',sans-serif",
        }}>Live</span>
      </div>
      <div>
        <p style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{value}</p>
        <p style={{ fontSize: 10, marginTop: 4, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "5px 0 0" }}>{label}</p>
      </div>
      <div>
        <p style={{ fontSize: 10, color: up === true ? "#34d399" : up === false ? "#f87171" : t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "0 0 8px", fontWeight: 500 }}>{delta}</p>
        <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 99, background: color, width: hov ? `${Math.min(fillPct + 20, 100)}%` : `${fillPct}%`, transition: "width 0.65s ease", opacity: 0.85 }} />
        </div>
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: hov ? "60%" : "30%", height: 1,
        background: `linear-gradient(90deg,${color},transparent)`,
        transition: "width 0.5s ease", opacity: 0.5,
      }} />
    </div>
  );
}

/* ─── Trainer Leaderboard Card ─── */
function TrainerRow({ trainer, index, onClick, t }) {
  const [hov, setHov] = useState(false);
  const rankColors = ["#f59e0b", "#94a3b8", "#cd7c3c"];
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 10px", borderRadius: 12,
        background: hov ? t.recentItemBgHov : t.recentItemBg,
        border: `1px solid ${hov ? t.recentItemBorder : "transparent"}`,
        transition: "all 0.15s", cursor: "pointer", marginBottom: 6,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 800, color: rankColors[index] || t.textMuted, width: 20, fontFamily: "'Poppins',sans-serif", flexShrink: 0 }}>#{index + 1}</span>
      <div style={{
        width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0, background: GRAD[index] || GRAD[3],
      }}>
        {trainer.name?.charAt(0) || "?"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trainer.name}</p>
        <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{trainer.total} reviews</p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontSize: 16, fontWeight: 800, color: parseFloat(trainer.rating) >= 4 ? "#34d399" : "#f59e0b", margin: 0, fontFamily: "'Poppins',sans-serif" }}>{trainer.rating}</p>
        <p style={{ fontSize: 9, color: t.textMuted, margin: "1px 0 0", fontFamily: "'Poppins',sans-serif" }}>avg</p>
      </div>
    </div>
  );
}

/* ─── Feedback Table Row ─── */
function FeedbackRow({ f, onView, t }) {
  const [hov, setHov] = useState(false);
  const a = parseFloat(avg(f));
  const ac = ratingColor(a);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr 80px 110px 70px 80px",
        alignItems: "center", gap: 8,
        padding: "11px 16px", borderRadius: 12,
        background: hov ? t.recentItemBgHov : "transparent",
        border: `1px solid ${hov ? t.recentItemBorder : "transparent"}`,
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 18 }}>{f.mood}</span>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{f.batch}</p>
      </div>
      <p style={{ fontSize: 11, color: t.textSub, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{f.trainer}</p>
      <p style={{ fontSize: 11, color: t.textSub, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.student}</p>
      <p style={{ fontSize: 16, fontWeight: 800, color: ac, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{avg(f)}</p>
      <div><StatusBadge status={f.status} t={t} /></div>
      <p style={{ fontSize: 10, color: t.textMuted, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{f.date}</p>
      <button
        onClick={() => onView(f)}
        style={{
          padding: "5px 12px", borderRadius: 8,
          border: `1px solid ${t.border}`, background: t.pillBg,
          color: t.textSub, fontSize: 10, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Poppins',sans-serif", transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#a78bfa55"; e.currentTarget.style.color = "#a78bfa"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSub; }}
      >
        View →
      </button>
    </div>
  );
}

/* ─── Modal ─── */
function Modal({ t, title, onClose, children, maxWidth = 560 }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: t.modalBg, border: `1px solid ${t.modalBorder}`,
          borderRadius: 20, padding: 24, maxWidth, width: "92%",
          maxHeight: "90vh", overflowY: "auto", boxShadow: t.shadowHov,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{title}</h3>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8,
            border: `1px solid ${t.border}`, background: t.actBg,
            color: t.textMuted, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function AdminFeedback() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
    )
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
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [feedbackList, setFeedbackList] = useState(MOCK);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [trainerModal, setTrainerModal] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  /* ── Alert Config state ── */
  const [alertModal, setAlertModal] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertSaving, setAlertSaving] = useState(false);
  const [alertSaveMsg, setAlertSaveMsg] = useState(null);
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
    getAllBatches()
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : [];
        setBatches(list);
        if (list.length > 0) setSelectedBatchId(list[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;
    setLoadingFeedback(true);
    getBatchFeedback(selectedBatchId)
      .then((r) => {
        setFeedbackList(r.data.map((f) => ({
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
          date: new Date(f.createdAt).toLocaleDateString(),
        })));
      })
      .catch(() => { setFeedbackList(MOCK); })
      .finally(() => setLoadingFeedback(false));
  }, [selectedBatchId]);

  function openAlertModal() {
    setAlertModal(true);
    setAlertSaveMsg(null);
    if (!selectedBatchId) return;
    setAlertLoading(true);
    getAlertConfig(selectedBatchId)
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
    if (!selectedBatchId) return;
    setAlertSaving(true);
    setAlertSaveMsg(null);
    try {
      await createOrUpdateAlertConfig({
        batchId: selectedBatchId,
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
      setAlertSaveMsg({ type: "success", text: "Alert config saved successfully." });
    } catch {
      setAlertSaveMsg({ type: "error", text: "Failed to save. Please try again." });
    } finally {
      setAlertSaving(false);
    }
  }

  async function handleDeleteAlertConfig() {
    if (!selectedBatchId) return;
    if (!window.confirm("Delete alert config for this batch?")) return;
    try {
      await deleteAlertConfig(selectedBatchId);
      setAlertSaveMsg({ type: "success", text: "Alert config deleted." });
      setAlertConfig({
        trainerEmail: "", sendToTrainer: true, sendToStudent: false, sendToAdmin: true,
        alertLowRatings: true, lowRatingThreshold: 3.0,
        trainerMessage: DEFAULT_TRAINER_MSG, studentMessage: DEFAULT_STUDENT_MSG, adminMessage: DEFAULT_ADMIN_MSG,
      });
    } catch {
      setAlertSaveMsg({ type: "error", text: "Failed to delete." });
    }
  }

  const filtered = feedbackList.filter((f) => {
    const mf = filter === "all" ? true : filter === "new" ? f.status === "SUBMITTED" : filter === "reviewed" ? f.status === "REVIEWED" : filter === "flag" ? parseFloat(avg(f)) < 3.5 : true;
    const ms = ((f.student || "") + (f.batch || "") + (f.trainer || "")).toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  async function adminAction(type) {
    if (!selected) return;
    const status = type === "reviewed" ? "REVIEWED" : "ARCHIVED";
    try { await updateFeedbackStatus(selected.id, status); } catch {}
    setFeedbackList((prev) => prev.map((x) => (x.id === selected.id ? { ...x, status } : x)));
    setSelected(null);
  }

  const platAvg = feedbackList.length
    ? (feedbackList.reduce((s, f) => s + parseFloat(avg(f)), 0) / feedbackList.length).toFixed(1)
    : "—";
  const needsAttn = feedbackList.filter((f) => parseFloat(avg(f)) < 3.0).length;
  const anonCount = feedbackList.filter((f) => f.student === "Anonymous").length;
  const anonPct = feedbackList.length ? `${Math.round((anonCount / feedbackList.length) * 100)}%` : "0%";

  const batchPerformance = (batches.length > 0 ? batches : [
    { id: 1, name: "Java FS — W6" }, { id: 2, name: "React — W3" },
    { id: 3, name: "Spring — W4" }, { id: 4, name: "DevOps — W2" },
  ]).slice(0, 4).map((b) => {
    const bf = feedbackList.filter((f) => f.batchId === b.id || f.batch === b.name);
    const rating = bf.length ? (bf.reduce((s, f) => s + parseFloat(avg(f)), 0) / bf.length).toFixed(1) : (3 + Math.random()).toFixed(1);
    return { name: b.name || `Batch #${b.id}`, count: bf.length || Math.floor(Math.random() * 40 + 10), rating: parseFloat(rating), pct: Math.min((parseFloat(rating) / 5) * 100, 100) };
  });

  const trainerStats = Object.values(
    feedbackList.reduce((acc, f) => {
      if (!acc[f.trainer]) acc[f.trainer] = { name: f.trainer, total: 0, sum: 0 };
      acc[f.trainer].total++;
      acc[f.trainer].sum += parseFloat(avg(f));
      return acc;
    }, {})
  ).map((t) => ({ ...t, rating: (t.sum / t.total).toFixed(1) })).sort((a, b) => b.rating - a.rating).slice(0, 4);

  const tagStats = Object.entries(
    feedbackList.reduce((acc, f) => { (f.tags || []).forEach((tag) => { acc[tag] = (acc[tag] || 0) + 1; }); return acc; }, {})
  ).map(([tag, count]) => ({ text: `${tag} ×${count}`, count })).sort((a, b) => b.count - a.count).slice(0, 10);

  const selectedBatchName = batches.find((b) => b.id === selectedBatchId)?.name || `Batch #${selectedBatchId}`;

  const statsData = [
    { label: "Total Feedback", value: feedbackList.length, delta: "↑ 24 this week", up: true, fillPct: 78, color: "#6366f1", icon: BarChart3 },
    { label: "Active Batches", value: batches.length || 4, delta: "Across 4 tracks", up: null, fillPct: 60, color: "#22d3ee", icon: Layers },
    { label: "Platform Avg", value: platAvg, delta: "↑ 0.2 vs last month", up: true, fillPct: 82, color: "#34d399", icon: Star },
    { label: "Needs Attention", value: needsAttn, delta: "Ratings below 3.0", up: false, fillPct: Math.min((needsAttn / Math.max(feedbackList.length, 1)) * 100, 100), color: "#f87171", icon: AlertCircle },
    { label: "Anonymous Rate", value: anonPct, delta: `${anonCount} anonymous`, up: null, fillPct: 68, color: "#a78bfa", icon: Shield },
  ];

  const inp = {
    background: t.inputBg, border: `1px solid ${t.inputBorder}`,
    color: t.inputText, borderRadius: 10, padding: "9px 12px",
    fontSize: 12, fontFamily: "'Poppins',sans-serif", outline: "none",
    width: "100%", boxSizing: "border-box",
  };

  const recipientRows = [
    { key: "sendToTrainer", label: "Notify Trainer", sub: "Send alert to the trainer of this batch", msgKey: "trainerMessage", icon: Users, color: "#22d3ee" },
    { key: "sendToStudent", label: "Notify Students", sub: "Send alert to students in this batch", msgKey: "studentMessage", icon: BookOpen, color: "#34d399" },
    { key: "sendToAdmin", label: "Notify Admin", sub: "Send alert to all admin users", msgKey: "adminMessage", icon: Shield, color: "#a78bfa" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .afade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}
        .d2{animation:blink 1.6s 0.3s ease infinite}
        .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes shimmer{0%,100%{opacity:0.5}50%{opacity:1}}
        input:focus,textarea:focus,select:focus{border-color:#6366f1 !important;outline:none;}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
        <div style={{ position: "relative", zIndex: 1, padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO ═══ */}
          <div className="afade" style={{
            borderRadius: 16, padding: "18px 24px",
            background: t.heroBg, border: `1px solid ${t.borderHero}`,
            marginBottom: 14, boxShadow: t.shadow, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", opacity: 1,
              backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(99,102,241,0.07),transparent 70%)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap", position: "relative" }}>
              {/* Left */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: "1 1 auto", minWidth: 0 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.heroBadgeDot }} className="d1" />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: t.heroBadgeText, fontFamily: "'Poppins',sans-serif" }}>Admin Portal</span>
                  </div>
                  <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.3rem,2.5vw,1.9rem)", color: t.heroTitle, margin: "0 0 3px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                    Feedback{" "}
                    <span style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Analytics</span>
                  </h1>
                  <p style={{ fontSize: 11, color: t.heroSub, margin: 0, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>
                    Platform-wide feedback intelligence · Real-time insights
                  </p>
                </div>

                {/* Batch selector + Quick actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: t.heroStatBg, border: `1px solid ${t.heroStatBorder}`,
                    borderRadius: 10, padding: "6px 12px",
                  }}>
                    <Layers size={11} color={t.heroActIcon} />
                    <select
                      value={selectedBatchId ?? ""}
                      onChange={(e) => setSelectedBatchId(Number(e.target.value))}
                      style={{ background: "transparent", border: "none", color: t.text, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", outline: "none" }}
                    >
                      {batches.length === 0 && <option value="">No batches</option>}
                      {batches.map((b) => <option key={b.id} value={b.id}>{b.name || `Batch #${b.id}`}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={() => {}}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                      border: `1px solid ${t.heroBtnBorder}`, background: t.heroBtnBg,
                      color: t.heroBtnColor, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <Download size={11} /> Export CSV
                  </button>
                  <button
                    onClick={openAlertModal}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                      border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      color: "#fff", cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                      boxShadow: "0 3px 10px rgba(99,102,241,0.4)",
                    }}
                  >
                    <Bell size={11} /> Configure Alerts
                  </button>
                </div>

                {/* Status row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: t.heroStatBg, border: `1px solid ${t.heroStatBorder}`,
                    borderRadius: 10, padding: "5px 12px",
                    fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif", color: t.heroStatText,
                  }}>
                    <span>{feedbackList.length} feedback entries</span>
                    <span style={{ width: 1, height: 12, background: t.heroStatDiv }} />
                    <span>{batches.length} batches</span>
                    <span style={{ width: 1, height: 12, background: t.heroStatDiv }} />
                    {needsAttn > 0
                      ? <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#f87171", fontWeight: 700 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", display: "inline-block" }} />
                          {needsAttn} need attention
                        </span>
                      : <span style={{ color: t.liveText, fontWeight: 700 }}>All clear ✓</span>
                    }
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, background: t.heroActBg, border: `1px solid ${t.heroActBorder}`, borderRadius: 8, padding: "5px 10px" }}>
                    <Activity size={12} color={t.heroActIcon} />
                    <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 14 }}>
                      <span className="d1" style={{ width: 3, height: 10, borderRadius: 2, background: t.heroActBar, display: "block" }} />
                      <span className="d2" style={{ width: 3, height: 14, borderRadius: 2, background: t.heroActBar, display: "block" }} />
                      <span className="d3" style={{ width: 3, height: 7, borderRadius: 2, background: t.heroActBar, display: "block" }} />
                    </div>
                  </div>
                  <div className="livebadge" style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: 999, padding: "5px 12px", color: "#34d399", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", fontFamily: "'Poppins',sans-serif" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />LIVE
                  </div>
                </div>
              </div>

              {/* Right stat pills */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: "0 0 auto", alignSelf: "stretch", justifyContent: "center" }}>
                {[
                  { label: "Platform Avg", value: platAvg, color: "#34d399", sub: "Overall rating" },
                  { label: "Needs Attention", value: needsAttn, color: "#f87171", sub: "Below 3.0 avg" },
                  { label: "Anonymous", value: anonPct, color: "#a78bfa", sub: "Of all feedback" },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: t.heroStatBg, border: `1px solid ${t.heroStatBorder}`,
                    borderRadius: 12, padding: "9px 16px", minWidth: 130,
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, borderRadius: "12px 0 0 12px", background: item.color }} />
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: t.heroStatText, fontFamily: "'Poppins',sans-serif", marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: item.color, fontFamily: "'Poppins',sans-serif", lineHeight: 1 }}>{item.value}</div>
                    <div style={{ fontSize: 9, color: t.heroSub, marginTop: 2, fontFamily: "'Poppins',sans-serif" }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ STAT CARDS ═══ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
            {statsData.map((s, i) => <StatCard key={i} {...s} t={t} />)}
          </div>

          {/* ═══ ANALYTICS ROW ═══ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>

            {/* Trainer Leaderboard */}
            <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <IconBox color="#f59e0b" icon={Star} />
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Trainer Leaderboard</span>
                </div>
                <Pill t={t}>This Month</Pill>
              </div>
              {trainerStats.length === 0 ? (
                [1, 2, 3].map(i => <SkeletonRow key={i} t={t} />)
              ) : (
                trainerStats.map((tr, i) => (
                  <TrainerRow key={i} trainer={tr} index={i} onClick={() => setTrainerModal(tr)} t={t} />
                ))
              )}
            </div>

            {/* Batch Performance */}
            <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <IconBox color="#22d3ee" icon={BarChart3} />
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Batch Performance</span>
                </div>
                <Pill t={t}>Platform</Pill>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {batchPerformance.map((b) => (
                  <div key={b.name}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{b.name}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{b.count} reviews</span>
                        <Pill t={t} color={b.rating >= 4 ? "#34d399" : b.rating >= 3 ? "#f59e0b" : "#f87171"}>{b.rating}</Pill>
                      </div>
                    </div>
                    <div style={{ height: 5, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99, background: b.rating >= 4 ? "#34d399" : b.rating >= 3 ? "#f59e0b" : "#f87171", width: `${b.pct}%`, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Tags */}
            <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 22, boxShadow: t.shadow }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <IconBox color="#a78bfa" icon={Tag} />
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Top Feedback Tags</span>
                </div>
                <Pill t={t}>All time</Pill>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {(tagStats.length > 0 ? tagStats : [
                  { text: "Just right ×24", count: 24 }, { text: "Great demos ×18", count: 18 },
                  { text: "Too fast ×12", count: 12 }, { text: "Notes & resources ×8", count: 8 },
                  { text: "Hard to follow ×6", count: 6 },
                ]).map((tag, i) => {
                  const c = TAG_COLORS[i % TAG_COLORS.length];
                  return (
                    <span key={tag.text} style={{
                      fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 999,
                      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
                      fontFamily: "'Poppins',sans-serif",
                    }}>{tag.text}</span>
                  );
                })}
              </div>
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 14 }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: t.textLabel, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif", margin: "0 0 10px" }}>Improvement Requests</p>
                {[
                  ["Recorded sessions", "+12%", "#f59e0b"],
                  ["Weekend doubt sessions", "+8%", "#6366f1"],
                  ["Better notes", "+5%", "#6366f1"],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 11, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>{label}</span>
                    <Pill t={t} color={color}>{val}</Pill>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ FEEDBACK TABLE ═══ */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow, overflow: "hidden" }} className="afade">

            {/* Table header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: `1px solid ${t.border}`, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <IconBox color="#6366f1" icon={Filter} />
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>All Feedback</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {/* Search */}
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Search size={12} color={t.textMuted} style={{ position: "absolute", left: 10 }} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by student, batch, trainer..."
                    style={{ ...inp, paddingLeft: 30, width: 240 }}
                  />
                </div>
                {/* Filters */}
                <div style={{ display: "flex", gap: 4 }}>
                  {[["all", "All"], ["new", "New"], ["reviewed", "Reviewed"], ["flag", "⚠ Low"]].map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setFilter(v)}
                      style={{
                        padding: "6px 14px", borderRadius: 8, fontSize: 10, fontWeight: 700,
                        cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.15s",
                        border: filter === v ? "1px solid rgba(99,102,241,0.4)" : `1px solid ${t.border}`,
                        background: filter === v ? "rgba(99,102,241,0.12)" : "transparent",
                        color: filter === v ? "#a78bfa" : t.textMuted,
                      }}
                    >{l}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table column headers */}
            <div style={{
              display: "grid", gridTemplateColumns: "40px 1fr 1fr 1fr 80px 110px 70px 80px",
              gap: 8, padding: "10px 16px",
              borderBottom: `1px solid ${t.border}`,
            }}>
              {["Mood", "Batch", "Trainer", "Student", "Avg", "Status", "Date", ""].map((h) => (
                <p key={h} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{h}</p>
              ))}
            </div>

            {/* Table body */}
            <div style={{ padding: "8px 4px" }}>
              {loadingFeedback ? (
                <div style={{ padding: "20px 16px" }}>
                  {[1, 2, 3].map(i => <SkeletonRow key={i} t={t} />)}
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
                    <BarChart3 size={20} color={t.emptyIcon} />
                  </div>
                  <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0, fontWeight: 500 }}>No feedback found</p>
                </div>
              ) : (
                filtered.map((f) => (
                  <FeedbackRow key={f.id} f={f} onView={(fb) => { setSelected(fb); setActiveTab("overview"); }} t={t} />
                ))
              )}
            </div>
          </div>

          {/* ═══ QUICK ACTIONS BAR ═══ */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: "14px 20px", boxShadow: t.shadow, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginTop: 14 }} className="afade">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 10 }}>
              <Zap size={14} color={t.textLabel} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textLabel, fontFamily: "'Poppins',sans-serif" }}>Quick Actions</span>
            </div>
            {[
              { label: "Export Report", color: "#22d3ee" },
              { label: "Configure Alerts", color: "#6366f1", action: openAlertModal },
              { label: "View Trainers", color: "#34d399" },
              { label: "Batch Summary", color: "#f59e0b" },
              { label: "Flag Low Ratings", color: "#f87171", action: () => setFilter("flag") },
            ].map((a) => {
              const [hov, setHov] = useState(false);
              return (
                <button
                  key={a.label}
                  onClick={a.action}
                  onMouseEnter={() => setHov(true)}
                  onMouseLeave={() => setHov(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 10,
                    border: `1px solid ${hov ? a.color + "55" : t.border}`,
                    background: hov ? `${a.color}12` : "transparent",
                    color: hov ? a.color : t.textMuted,
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.2s", fontFamily: "'Poppins',sans-serif",
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: hov ? a.color : t.textMuted, transition: "background 0.2s", flexShrink: 0 }} />
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ FEEDBACK DETAIL MODAL ═══ */}
      {selected && (
        <Modal t={t} title={`Feedback #${selected.id} — ${selected.batch}`} onClose={() => setSelected(null)} maxWidth={560}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 20, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 12, padding: 4 }}>
            {["overview", "ratings", "comment"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: "8px", borderRadius: 9, fontSize: 11, fontWeight: 700,
                  cursor: "pointer", border: "none", transition: "all 0.2s", textTransform: "capitalize",
                  background: activeTab === tab ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                  color: activeTab === tab ? "#fff" : t.textSub,
                  boxShadow: activeTab === tab ? "0 3px 10px rgba(99,102,241,0.4)" : "none",
                  fontFamily: "'Poppins',sans-serif",
                }}
              >{tab}</button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                ["Student", selected.student], ["Trainer", selected.trainer],
                ["Batch", selected.batch], ["Mood", selected.mood],
                ["Status", selected.status], ["Date", selected.date],
                ["Overall Avg", `${avg(selected)} / 5.0`], ["Anonymous", selected.student === "Anonymous" ? "Yes" : "No"],
              ].map(([l, v]) => (
                <div key={l} style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: 12, padding: "12px 14px" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: "0 0 4px" }}>{l}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "ratings" && (
            <div>
              <RatingBar label="Clarity of explanation" val={selected.clarity} t={t} />
              <RatingBar label="Doubt clearing" val={selected.doubt} t={t} />
              <RatingBar label="Energy & engagement" val={selected.energy} t={t} />
              <RatingBar label="Technical depth" val={selected.depth} t={t} />
              <div style={{ marginTop: 16, padding: "14px", background: t.recentItemBg, borderRadius: 12, border: `1px solid ${t.recentItemBorder}`, textAlign: "center" }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: ratingColor(parseFloat(avg(selected))), margin: 0, fontFamily: "'Poppins',sans-serif" }}>{avg(selected)}</p>
                <p style={{ fontSize: 10, color: t.textMuted, margin: "4px 0 0", fontFamily: "'Poppins',sans-serif" }}>Overall average</p>
              </div>
            </div>
          )}

          {activeTab === "comment" && (
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: "0 0 10px" }}>Tags</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                {(selected.tags || []).map((tag, i) => {
                  const c = TAG_COLORS[i % TAG_COLORS.length];
                  return <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 999, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: "'Poppins',sans-serif" }}>{tag}</span>;
                })}
              </div>
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: "0 0 10px" }}>Comment</p>
              {selected.comment
                ? <div style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: 12, padding: 14, fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif", lineHeight: 1.7, fontStyle: "italic" }}>"{selected.comment}"</div>
                : <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>No comment provided.</p>
              }
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            {[
              { label: "Mark Reviewed", icon: CheckCircle, color: "#34d399", action: () => adminAction("reviewed") },
              { label: "Archive", icon: Archive, color: t.textSub, action: () => adminAction("archive"), outline: true },
              { label: "Flag", icon: Flag, color: "#f87171", action: () => setSelected(null) },
            ].map(({ label, icon: Icon, color, action, outline }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: outline ? "transparent" : `${color}15`,
                  border: `1px solid ${color}40`,
                  color,
                }}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* ═══ TRAINER DETAIL MODAL ═══ */}
      {trainerModal && (
        <Modal t={t} title={trainerModal.name} onClose={() => setTrainerModal(null)} maxWidth={480}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[["Total Reviews", trainerModal.total], ["Avg Rating", `${trainerModal.rating} / 5.0`], ["Active Batches", "2"], ["Rank", "#1"]].map(([l, v]) => (
              <div key={l} style={{ background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, borderRadius: 12, padding: "12px 14px" }}>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: "0 0 4px" }}>{l}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif", margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
          <RatingBar label="Clarity" val={4} t={t} />
          <RatingBar label="Doubt clearing" val={3} t={t} />
          <RatingBar label="Energy" val={4} t={t} />
          <RatingBar label="Technical depth" val={4} t={t} />
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            <button onClick={() => setTrainerModal(null)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>Send Appreciation</button>
            <button onClick={() => setTrainerModal(null)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.actBg, color: t.textSub, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>View All Sessions</button>
          </div>
        </Modal>
      )}

      {/* ═══ CONFIGURE ALERTS MODAL ═══ */}
      {alertModal && (
        <Modal t={t} title="Configure Alerts" onClose={() => setAlertModal(false)} maxWidth={560}>
          <p style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "-10px 0 16px" }}>{selectedBatchName}</p>

          {alertSaveMsg && (
            <div style={{
              padding: "10px 14px", borderRadius: 10, marginBottom: 16, fontSize: 11, fontWeight: 600, fontFamily: "'Poppins',sans-serif", textAlign: "center",
              background: alertSaveMsg.type === "success" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
              border: `1px solid ${alertSaveMsg.type === "success" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
              color: alertSaveMsg.type === "success" ? "#34d399" : "#f87171",
            }}>{alertSaveMsg.text}</div>
          )}

          {alertLoading ? (
            <div style={{ padding: "20px 0" }}>{[1, 2, 3].map(i => <SkeletonRow key={i} t={t} />)}</div>
          ) : (
            <>
              {/* Trainer email */}
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: "0 0 8px" }}>Trainer Email</p>
              <input
                value={alertConfig.trainerEmail}
                onChange={(e) => setAlertConfig(p => ({ ...p, trainerEmail: e.target.value }))}
                placeholder="trainer@example.com"
                style={{ ...inp, marginBottom: 20 }}
              />

              {/* Recipients */}
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: "0 0 10px" }}>Notify Recipients</p>
              {recipientRows.map(({ key, label, sub, msgKey, icon: Icon, color }) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 14px", borderRadius: 10,
                    background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`,
                    marginBottom: alertConfig[key] ? 6 : 0,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={13} color={color} />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{label}</p>
                        <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{sub}</p>
                      </div>
                    </div>
                    <Toggle checked={alertConfig[key]} onChange={(val) => setAlertConfig(p => ({ ...p, [key]: val }))} t={t} />
                  </div>
                  {alertConfig[key] && (
                    <textarea
                      rows={2}
                      value={alertConfig[msgKey]}
                      onChange={(e) => setAlertConfig(p => ({ ...p, [msgKey]: e.target.value }))}
                      style={{ ...inp, resize: "vertical", lineHeight: 1.6, padding: "9px 12px" }}
                    />
                  )}
                </div>
              ))}

              {/* Low rating threshold */}
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: "16px 0 10px" }}>Low Rating Alerts</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 10, background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Alert on Low Ratings</p>
                  <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>Trigger alert when avg drops below threshold</p>
                </div>
                <Toggle checked={alertConfig.alertLowRatings} onChange={(val) => setAlertConfig(p => ({ ...p, alertLowRatings: val }))} t={t} />
              </div>
              {alertConfig.alertLowRatings && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Low Rating Threshold</p>
                    <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>Alert triggers below this value</p>
                  </div>
                  <input
                    type="number" min="1" max="5" step="0.1"
                    value={alertConfig.lowRatingThreshold}
                    onChange={(e) => setAlertConfig(p => ({ ...p, lowRatingThreshold: e.target.value }))}
                    style={{ width: 70, padding: "8px 10px", borderRadius: 9, background: "rgba(99,102,241,0.1)", border: "1.5px solid rgba(99,102,241,0.3)", color: "#a78bfa", fontSize: 13, fontWeight: 700, fontFamily: "'Poppins',sans-serif", outline: "none", textAlign: "center" }}
                  />
                </div>
              )}

              {/* Modal actions */}
              <div style={{ display: "flex", gap: 8, marginTop: 20, alignItems: "center" }}>
                <button
                  onClick={saveAlertConfig}
                  disabled={alertSaving}
                  style={{
                    flex: 1, padding: "11px", borderRadius: 10, border: "none",
                    background: alertSaving ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    fontFamily: "'Poppins',sans-serif", boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                  }}
                >{alertSaving ? "Saving..." : "Save Config"}</button>
                <button
                  onClick={() => setAlertModal(false)}
                  style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.actBg, color: t.textSub, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
                >Cancel</button>
                <button
                  onClick={handleDeleteAlertConfig}
                  style={{ padding: "11px 16px", borderRadius: 10, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 5 }}
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