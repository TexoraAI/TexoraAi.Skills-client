
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

const MOCK = [
  {
    id: 1,
    mood: "🤩",
    batch: "Java FS W6",
    trainer: "Anil Kumar",
    student: "Anonymous",
    clarity: 5,
    doubt: 4,
    energy: 5,
    depth: 4,
    tags: ["Just right", "Great demos"],
    comment: "Best session! Spring Boot deep dive was excellent.",
    status: "SUBMITTED",
    date: "Apr 15",
  },
  {
    id: 2,
    mood: "😊",
    batch: "Java FS W6",
    trainer: "Anil Kumar",
    student: "Priya M.",
    clarity: 4,
    doubt: 4,
    energy: 4,
    depth: 3,
    tags: ["Just right"],
    comment: "",
    status: "REVIEWED",
    date: "Apr 15",
  },
  {
    id: 3,
    mood: "😐",
    batch: "React W3",
    trainer: "Sneha R.",
    student: "Anonymous",
    clarity: 3,
    doubt: 2,
    energy: 3,
    depth: 3,
    tags: ["Too fast"],
    comment: "Needs to slow down during hooks.",
    status: "SUBMITTED",
    date: "Apr 14",
  },
  {
    id: 4,
    mood: "😞",
    batch: "DevOps W2",
    trainer: "Divya P.",
    student: "Anonymous",
    clarity: 2,
    doubt: 1,
    energy: 2,
    depth: 2,
    tags: ["Hard to follow", "Too fast"],
    comment: "Couldn't understand Kubernetes networking.",
    status: "SUBMITTED",
    date: "Apr 14",
  },
  {
    id: 5,
    mood: "🤩",
    batch: "React W3",
    trainer: "Sneha R.",
    student: "Ravi K.",
    clarity: 5,
    doubt: 5,
    energy: 5,
    depth: 5,
    tags: ["Just right", "Great demos"],
    comment: "Absolutely loved it!",
    status: "REVIEWED",
    date: "Apr 13",
  },
  {
    id: 6,
    mood: "😊",
    batch: "Spring W4",
    trainer: "Karthik M.",
    student: "Anonymous",
    clarity: 4,
    doubt: 3,
    energy: 4,
    depth: 4,
    tags: ["Notes & resources"],
    comment: "Please share slides.",
    status: "SUBMITTED",
    date: "Apr 13",
  },
];

const TAG_COLORS = [
  {
    bg: "rgba(34,197,94,0.1)",
    color: "#4ade80",
    border: "rgba(34,197,94,0.25)",
  },
  {
    bg: "rgba(99,102,241,0.1)",
    color: "#a5b4fc",
    border: "rgba(99,102,241,0.25)",
  },
  {
    bg: "rgba(239,68,68,0.1)",
    color: "#fca5a5",
    border: "rgba(239,68,68,0.25)",
  },
  {
    bg: "rgba(245,158,11,0.1)",
    color: "#fcd34d",
    border: "rgba(245,158,11,0.25)",
  },
  {
    bg: "rgba(14,165,233,0.1)",
    color: "#7dd3fc",
    border: "rgba(14,165,233,0.25)",
  },
];

const moodEmoji = {
  AMAZING: "🤩",
  GOOD: "😊",
  FINE: "🙂",
  OKAY: "😐",
  POOR: "😞",
};

const styles = `
  .af-root { font-family: Arial, sans-serif; min-height: 100vh; background: #060a14; color: #e2e8f0; }
  .af-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 80% 60% at 0% 0%, rgba(99,102,241,0.14) 0%, transparent 50%),
      radial-gradient(ellipse 60% 50% at 100% 100%, rgba(168,85,247,0.1) 0%, transparent 50%),
      radial-gradient(ellipse 40% 30% at 50% 100%, rgba(14,165,233,0.06) 0%, transparent 50%);
  }
  .af-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  .af-main { position: relative; z-index: 1; padding: 2.5rem 3rem; max-width: 1600px; margin: 0 auto; }
  .af-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 16px; }
  .af-header-left h1 { font-size: 1.8rem; font-weight: 800; color: #f8fafc; letter-spacing: -0.02em; margin-bottom: 4px; font-family: Arial, sans-serif; }
  .af-header-left p { font-size: 13px; color: #475569; font-family: Arial, sans-serif; }
  .af-header-right { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .af-batch-select {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; padding: 10px 16px;
  }
  .af-batch-select select {
    background: transparent; border: none; color: #e2e8f0;
    font-family: Arial, sans-serif; font-size: 13px; cursor: pointer; outline: none;
  }
  .af-btn-outline {
    padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;
    border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #64748b;
    cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s;
  }
  .af-btn-outline:hover { border-color: rgba(255,255,255,0.2); color: #94a3b8; }
  .af-btn-primary {
    padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 700;
    border: none; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: white;
    cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s;
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
  }
  .af-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
  .af-stats-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 14px; margin-bottom: 2rem; }
  .af-stat-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 20px 18px; position: relative; overflow: hidden;
    transition: border-color 0.2s;
  }
  .af-stat-card:hover { border-color: rgba(255,255,255,0.12); }
  .af-stat-label { font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; font-family: Arial, sans-serif; }
  .af-stat-val { font-size: 2rem; font-weight: 800; font-family: Arial, sans-serif; margin-bottom: 4px; }
  .af-stat-delta { font-size: 11px; font-family: Arial, sans-serif; margin-bottom: 14px; }
  .af-stat-bar { height: 3px; border-radius: 2px; background: rgba(255,255,255,0.06); overflow: hidden; }
  .af-stat-fill { height: 100%; border-radius: 2px; }
  .af-3col { display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 16px; margin-bottom: 2rem; }
  .af-panel {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 22px;
  }
  .af-panel-title { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 18px; font-family: Arial, sans-serif; }
  .af-panel-badge {
    display: inline-flex; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 600;
    background: rgba(99,102,241,0.12); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.25);
    font-family: Arial, sans-serif;
  }
  .af-trainer-row {
    display: flex; align-items: center; gap: 12px; padding: 12px 14px;
    border-radius: 14px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  }
  .af-trainer-row:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); transform: translateX(2px); }
  .af-trainer-rank { font-size: 12px; font-weight: 800; font-family: Arial, sans-serif; min-width: 24px; }
  .af-trainer-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: white; flex-shrink: 0;
  }
  .af-trainer-info { flex: 1; }
  .af-trainer-name { font-size: 13px; font-weight: 700; color: #e2e8f0; font-family: Arial, sans-serif; }
  .af-trainer-spec { font-size: 11px; color: #475569; font-family: Arial, sans-serif; }
  .af-trainer-rating { font-size: 18px; font-weight: 800; font-family: Arial, sans-serif; }
  .af-trainer-rating-label { font-size: 10px; color: #334155; font-family: Arial, sans-serif; }
  .af-batch-table { width: 100%; border-collapse: collapse; }
  .af-batch-th { font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.07em; padding-bottom: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: Arial, sans-serif; }
  .af-batch-td { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .af-batch-name { font-size: 13px; font-weight: 700; color: #e2e8f0; font-family: Arial, sans-serif; }
  .af-batch-bar { height: 5px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; margin-top: 4px; }
  .af-batch-bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg,#6366f1,#a78bfa); }
  .af-batch-count { font-size: 12px; color: #64748b; font-family: Arial, sans-serif; }
  .af-batch-rating-badge { padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; font-family: Arial, sans-serif; }
  .af-tags-panel { }
  .af-tags-cloud { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .af-tag { padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 600; font-family: Arial, sans-serif; }
  .af-improve-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .af-improve-label { font-size: 12px; color: #64748b; font-family: Arial, sans-serif; }
  .af-improve-badge { padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; font-family: Arial, sans-serif; }
  .af-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 16px 0; }
  .af-section-mini-title { font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; font-family: Arial, sans-serif; }
  .af-table-wrap {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
  }
  .af-table-header {
    padding: 18px 24px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.07); flex-wrap: wrap; gap: 12px;
  }
  .af-table-title { font-size: 15px; font-weight: 700; color: #f8fafc; font-family: Arial, sans-serif; }
  .af-table-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .af-search {
    background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 8px 16px; font-size: 12px; color: #e2e8f0;
    font-family: Arial, sans-serif; outline: none; width: 220px; transition: border-color 0.2s;
  }
  .af-search:focus { border-color: rgba(99,102,241,0.4); }
  .af-search::placeholder { color: #334155; }
  .af-filter-btns { display: flex; gap: 8px; }
  .af-filter-btn { padding: 7px 16px; border-radius: 999px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s; }
  .af-table { width: 100%; border-collapse: collapse; }
  .af-th {
    padding: 12px 24px; font-size: 10px; font-weight: 700; color: #334155;
    text-transform: uppercase; letter-spacing: 0.07em; text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.06); font-family: Arial, sans-serif;
  }
  .af-td { padding: 14px 24px; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
  .af-td-text { font-size: 13px; color: #e2e8f0; font-family: Arial, sans-serif; font-weight: 600; }
  .af-td-sub { font-size: 12px; color: #475569; font-family: Arial, sans-serif; }
  .af-avg-badge { font-family: Arial, sans-serif; font-size: 15px; font-weight: 800; }
  .af-status-chip { padding: 4px 12px; border-radius: 999px; font-size: 10px; font-weight: 700; font-family: Arial, sans-serif; }
  .af-view-btn {
    padding: 7px 16px; border-radius: 999px; font-size: 11px; font-weight: 700;
    border: 1.5px solid rgba(255,255,255,0.1); background: transparent; color: #64748b;
    cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s;
  }
  .af-view-btn:hover { border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
  .af-empty { padding: 3rem; text-align: center; color: #334155; font-size: 13px; font-family: Arial, sans-serif; }
  .af-loading-table { padding: 2rem; text-align: center; color: #475569; font-size: 13px; font-family: Arial, sans-serif; }
  .af-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(16px);
  }
  .af-modal {
    background: #0d1526; border: 1px solid rgba(99,102,241,0.2);
    border-radius: 24px; padding: 32px; max-width: 620px; width: 92%;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
  }
  .af-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .af-modal-title { font-size: 1.15rem; font-weight: 800; color: #f8fafc; font-family: Arial, sans-serif; }
  .af-modal-close {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    color: #64748b; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
  }
  .af-tabs { display: flex; gap: 2px; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 4px; margin-bottom: 24px; }
  .af-tab {
    flex: 1; padding: 9px; border-radius: 10px; font-size: 12px; font-weight: 700;
    cursor: pointer; border: none; font-family: Arial, sans-serif; text-transform: capitalize; transition: all 0.2s;
  }
  .af-overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .af-overview-item {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 14px;
  }
  .af-overview-label { font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; font-family: Arial, sans-serif; }
  .af-overview-val { font-size: 14px; font-weight: 700; color: #e2e8f0; font-family: Arial, sans-serif; }
  .af-modal-tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .af-modal-tag { padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; background: rgba(99,102,241,0.12); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.25); font-family: Arial, sans-serif; }
  .af-modal-comment {
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 16px; font-size: 13px; color: #94a3b8;
    line-height: 1.7; font-style: italic; font-family: Arial, sans-serif;
  }
  .af-modal-actions { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; }
  .af-modal-btn { flex: 1; padding: 13px; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s; min-width: 120px; }
  .af-section-label { font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px; font-family: Arial, sans-serif; }

  /* ── ALERT CONFIG MODAL SPECIFIC ── */
  .ac-section-title {
    font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;
    letter-spacing: 0.08em; margin-bottom: 12px; font-family: Arial, sans-serif;
  }
  .ac-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; border-radius: 12px; margin-bottom: 4px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
    transition: border-color 0.2s;
  }
  .ac-toggle-row:hover { border-color: rgba(255,255,255,0.1); }
  .ac-toggle-label { font-size: 13px; color: #cbd5e1; font-family: Arial, sans-serif; font-weight: 600; }
  .ac-toggle-sub { font-size: 11px; color: #475569; font-family: Arial, sans-serif; margin-top: 2px; }
  .ac-toggle {
    position: relative; width: 44px; height: 24px; border-radius: 999px;
    cursor: pointer; transition: background 0.25s; border: none; flex-shrink: 0;
  }
  .ac-toggle-thumb {
    position: absolute; top: 3px; width: 18px; height: 18px; border-radius: 50%;
    background: white; transition: left 0.25s;
  }
  .ac-threshold-row {
    display: flex; align-items: center; gap: 14px; padding: 14px 16px;
    border-radius: 12px; margin-bottom: 8px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  }
  .ac-threshold-label { flex: 1; font-size: 13px; color: #cbd5e1; font-family: Arial, sans-serif; font-weight: 600; }
  .ac-threshold-input {
    width: 70px; padding: 7px 10px; border-radius: 8px; font-size: 13px; font-weight: 700;
    background: rgba(99,102,241,0.1); border: 1.5px solid rgba(99,102,241,0.3);
    color: #a5b4fc; font-family: Arial, sans-serif; outline: none; text-align: center;
  }
  .ac-threshold-input:focus { border-color: rgba(99,102,241,0.6); }
  .ac-status-banner {
    padding: 10px 16px; border-radius: 10px; font-size: 12px; font-weight: 600;
    font-family: Arial, sans-serif; margin-bottom: 18px; text-align: center;
  }
  .ac-delete-btn {
    padding: 10px 20px; border-radius: 12px; font-size: 12px; font-weight: 700;
    background: rgba(239,68,68,0.08); border: 1.5px solid rgba(239,68,68,0.25);
    color: #f87171; cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s;
  }
  .ac-delete-btn:hover { background: rgba(239,68,68,0.15); }

  /* ── NEW: Message textarea for alert config ── */
  .ac-msg-wrap {
    margin-bottom: 10px;
    padding: 0 2px;
  }
  .ac-msg-label {
    font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase;
    letter-spacing: 0.07em; margin-bottom: 6px; font-family: Arial, sans-serif;
    display: block;
  }
  .ac-msg-textarea {
    width: 100%; padding: 10px 14px; border-radius: 10px;
    background: rgba(99,102,241,0.06); border: 1.5px solid rgba(99,102,241,0.2);
    color: #cbd5e1; font-size: 12px; font-family: Arial, sans-serif;
    outline: none; resize: vertical; line-height: 1.6; box-sizing: border-box;
    transition: border-color 0.2s;
  }
  .ac-msg-textarea:focus { border-color: rgba(99,102,241,0.45); }
  .ac-msg-textarea::placeholder { color: #334155; }
  .ac-recipient-block {
    margin-bottom: 12px;
  }
`;

function avg(f) {
  return ((f.clarity + f.doubt + f.energy + f.depth) / 4).toFixed(1);
}

function RatingBar({ label, val }) {
  const color = val >= 4 ? "#22c55e" : val >= 3 ? "#eab308" : "#ef4444";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 12,
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: "#64748b",
          minWidth: 170,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 8,
          borderRadius: 4,
          background: "rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(val / 5) * 100}%`,
            height: "100%",
            borderRadius: 4,
            background: color,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          fontFamily: "Arial, sans-serif",
          color: "#e2e8f0",
          fontWeight: 700,
          minWidth: 28,
          textAlign: "right",
        }}
      >
        {val}/5
      </span>
    </div>
  );
}

// ── Toggle Switch component ────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      className="ac-toggle"
      onClick={() => onChange(!checked)}
      style={{ background: checked ? "#6366f1" : "rgba(255,255,255,0.08)" }}
    >
      <div
        className="ac-toggle-thumb"
        style={{ left: checked ? "23px" : "3px" }}
      />
    </button>
  );
}

const GRAD = [
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  "linear-gradient(135deg,#22d3ee,#0891b2)",
  "linear-gradient(135deg,#f43f5e,#be123c)",
];

// ── Default messages per recipient ────────────────────────────────────────
const DEFAULT_TRAINER_MSG =
  "Dear Trainer, your recent session ratings have dropped. Please focus on clarity and student engagement to improve your performance.";
const DEFAULT_STUDENT_MSG =
  "Dear Student, we have received your feedback and are actively working to resolve your concerns. Improvements are on the way!";
const DEFAULT_ADMIN_MSG =
  "Alert: Feedback ratings for this batch require your attention. Please review the dashboard for details.";

export default function AdminFeedback() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [feedbackList, setFeedbackList] = useState(MOCK);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [trainerModal, setTrainerModal] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // ── Alert Config state ─────────────────────────────────────────
  const [alertModal, setAlertModal] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertSaving, setAlertSaving] = useState(false);
  const [alertSaveMsg, setAlertSaveMsg] = useState(null); // { type: "success"|"error", text }
  const [alertConfig, setAlertConfig] = useState({
    trainerEmail: "",
    sendToTrainer: true,
    sendToStudent: false,
    sendToAdmin: true,
    alertLowRatings: true,
    lowRatingThreshold: 3.0,
    // ✅ NEW: Custom messages per recipient
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
        setFeedbackList(
          r.data.map((f) => ({
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
          })),
        );
      })
      .catch(() => {
        setFeedbackList(MOCK);
      })
      .finally(() => setLoadingFeedback(false));
  }, [selectedBatchId]);

  // ── Load existing alert config when modal opens ────────────────
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
            // ✅ NEW: Load saved messages, fall back to defaults
            trainerMessage: r.data.trainerMessage || DEFAULT_TRAINER_MSG,
            studentMessage: r.data.studentMessage || DEFAULT_STUDENT_MSG,
            adminMessage: r.data.adminMessage || DEFAULT_ADMIN_MSG,
          });
        }
      })
      .catch(() => {
        // No config yet — keep defaults, that's fine
      })
      .finally(() => setAlertLoading(false));
  }

  // ── Save alert config ──────────────────────────────────────────
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
        // ✅ NEW: Send custom messages to backend
        trainerMessage: alertConfig.trainerMessage,
        studentMessage: alertConfig.studentMessage,
        adminMessage: alertConfig.adminMessage,
      });
      setAlertSaveMsg({
        type: "success",
        text: "✅ Alert config saved! Kafka event published.",
      });
    } catch {
      setAlertSaveMsg({
        type: "error",
        text: "❌ Failed to save. Please try again.",
      });
    } finally {
      setAlertSaving(false);
    }
  }

  // ── Delete alert config ────────────────────────────────────────
  async function handleDeleteAlertConfig() {
    if (!selectedBatchId) return;
    if (!window.confirm("Delete alert config for this batch?")) return;
    try {
      await deleteAlertConfig(selectedBatchId);
      setAlertSaveMsg({ type: "success", text: "🗑️ Alert config deleted." });
      setAlertConfig({
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
    } catch {
      setAlertSaveMsg({ type: "error", text: "❌ Failed to delete." });
    }
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
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase());
    return mf && ms;
  });

  async function adminAction(type) {
    if (!selected) return;
    const status = type === "reviewed" ? "REVIEWED" : "ARCHIVED";
    try {
      await updateFeedbackStatus(selected.id, status);
    } catch {}
    setFeedbackList((prev) =>
      prev.map((x) => (x.id === selected.id ? { ...x, status } : x)),
    );
    setSelected(null);
  }

  const platAvg = feedbackList.length
    ? (
        feedbackList.reduce((s, f) => s + parseFloat(avg(f)), 0) /
        feedbackList.length
      ).toFixed(1)
    : "—";
  const needsAttn = feedbackList.filter((f) => parseFloat(avg(f)) < 3.0).length;
  const anonCount = feedbackList.filter(
    (f) => f.student === "Anonymous",
  ).length;
  const anonPct = feedbackList.length
    ? `${Math.round((anonCount / feedbackList.length) * 100)}%`
    : "0%";

  const batchPerformance = batches.slice(0, 4).map((b) => {
    const bf = feedbackList.filter(
      (f) => f.batchId === b.id || f.batch === b.name,
    );
    const rating = bf.length
      ? (bf.reduce((s, f) => s + parseFloat(avg(f)), 0) / bf.length).toFixed(1)
      : 0;
    return {
      name: b.name || `Batch #${b.id}`,
      count: bf.length,
      rating: parseFloat(rating) || 0,
      pct: Math.min((parseFloat(rating) / 5) * 100, 100),
    };
  });

  const trainerStats = Object.values(
    feedbackList.reduce((acc, f) => {
      if (!acc[f.trainer])
        acc[f.trainer] = { name: f.trainer, total: 0, sum: 0 };
      acc[f.trainer].total++;
      acc[f.trainer].sum += parseFloat(avg(f));
      return acc;
    }, {}),
  )
    .map((t) => ({ ...t, rating: (t.sum / t.total).toFixed(1) }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const tagStats = Object.entries(
    feedbackList.reduce((acc, f) => {
      (f.tags || []).forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {}),
  )
    .map(([tag, count]) => ({ text: `${tag} ×${count}`, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const rankColor = (r) =>
    r === 1 ? "#fbbf24" : r === 2 ? "#94a3b8" : r === 3 ? "#cd7c3c" : "#334155";

  const stats = [
    {
      label: "Total Feedback",
      value: feedbackList.length || 0,
      delta: "↑ 24 this week",
      up: true,
      fill: "78%",
      color: "#6366f1",
    },
    {
      label: "Active Batches",
      value: batches.length || 0,
      delta: "across 4 tracks",
      up: null,
      fill: "60%",
      color: "#22d3ee",
    },
    {
      label: "Platform Avg",
      value: platAvg,
      delta: "↑ 0.2 vs last month",
      up: true,
      fill: "82%",
      color: "#22c55e",
    },
    {
      label: "Needs Attention",
      value: needsAttn,
      delta: "ratings below 3.0",
      up: false,
      fill: `${Math.min((needsAttn / Math.max(feedbackList.length, 1)) * 100, 100)}%`,
      color: "#ef4444",
      valColor: "#f87171",
    },
    {
      label: "Anonymous Rate",
      value: anonPct,
      delta: `${anonCount} anonymous`,
      up: null,
      fill: "68%",
      color: "#8b5cf6",
    },
  ];

  const selectedBatchName =
    batches.find((b) => b.id === selectedBatchId)?.name ||
    `Batch #${selectedBatchId}`;

  // ── Recipient config rows for alert modal ─────────────────────
  const recipientRows = [
    {
      key: "sendToTrainer",
      label: "Notify Trainer",
      sub: "Send alert to the trainer of this batch",
      msgKey: "trainerMessage",
      msgPlaceholder:
        "e.g. Please improve your session performance and clarity...",
      icon: "🧑‍🏫",
    },
    {
      key: "sendToStudent",
      label: "Notify Students",
      sub: "Send alert to students in this batch",
      msgKey: "studentMessage",
      msgPlaceholder: "e.g. We are working to resolve your concerns soon...",
      icon: "🎓",
    },
    {
      key: "sendToAdmin",
      label: "Notify Admin",
      sub: "Send alert to all admin users",
      msgKey: "adminMessage",
      msgPlaceholder: "e.g. Batch ratings require admin review and action...",
      icon: "🛡️",
    },
  ];

  return (
    <div className="af-root">
      <style>{styles}</style>
      <div className="af-bg" />
      <div className="af-grid" />
      <div className="af-main">
        {/* HEADER */}
        <div className="af-header">
          <div className="af-header-left">
            <h1>Feedback Analytics</h1>
            <p>Platform-wide feedback intelligence · April 2025</p>
          </div>
          <div className="af-header-right">
            <div className="af-batch-select">
              <span>📦</span>
              <select
                value={selectedBatchId ?? ""}
                onChange={(e) => setSelectedBatchId(Number(e.target.value))}
              >
                {batches.length === 0 && (
                  <option value="">No batches found</option>
                )}
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name || `Batch #${b.id}`}
                  </option>
                ))}
              </select>
            </div>
            <button className="af-btn-outline">📥 Export CSV</button>
            <button className="af-btn-primary" onClick={openAlertModal}>
              🔔 Configure Alerts
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="af-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="af-stat-card">
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  borderRadius: "18px 18px 0 0",
                  background: s.color,
                  opacity: 0.8,
                }}
              />
              <p className="af-stat-label">{s.label}</p>
              <p
                className="af-stat-val"
                style={{ color: s.valColor || "#f8fafc" }}
              >
                {s.value}
              </p>
              <p
                className="af-stat-delta"
                style={{
                  color:
                    s.up === true
                      ? "#4ade80"
                      : s.up === false
                        ? "#f87171"
                        : "#475569",
                }}
              >
                {s.delta}
              </p>
              <div className="af-stat-bar">
                <div
                  className="af-stat-fill"
                  style={{ width: s.fill, background: s.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 3 COL */}
        <div className="af-3col">
          {/* Trainer Leaderboard */}
          <div className="af-panel">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <span className="af-panel-title" style={{ margin: 0 }}>
                Trainer Leaderboard
              </span>
              <span className="af-panel-badge">This Month</span>
            </div>
            {trainerStats.map((t, idx) => (
              <div
                key={idx}
                className="af-trainer-row"
                onClick={() => setTrainerModal(t)}
              >
                <span
                  className="af-trainer-rank"
                  style={{ color: rankColor(idx + 1) }}
                >
                  #{idx + 1}
                </span>
                <div
                  className="af-trainer-avatar"
                  style={{ background: GRAD[idx] || GRAD[3] }}
                >
                  {t.name?.charAt(0) || "?"}
                </div>
                <div className="af-trainer-info">
                  <div className="af-trainer-name">{t.name}</div>
                  <div className="af-trainer-spec">{t.total} reviews</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    className="af-trainer-rating"
                    style={{ color: t.rating >= 4 ? "#f8fafc" : "#fbbf24" }}
                  >
                    {t.rating}
                  </div>
                  <div className="af-trainer-rating-label">avg</div>
                </div>
              </div>
            ))}
          </div>

          {/* Batch Performance */}
          <div className="af-panel">
            <p className="af-panel-title">Batch Performance</p>
            <table className="af-batch-table">
              <thead>
                <tr>
                  {["Batch", "Feedback", "Rating"].map((h) => (
                    <th key={h} className="af-batch-th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(batchPerformance.length
                  ? batchPerformance
                  : [
                      { name: "Java FS — W6", count: 48, rating: 4.2, pct: 86 },
                      { name: "React — W3", count: 36, rating: 4.0, pct: 70 },
                      { name: "Spring — W4", count: 29, rating: 3.5, pct: 55 },
                      { name: "DevOps — W2", count: 21, rating: 3.2, pct: 40 },
                    ]
                ).map((b) => (
                  <tr key={b.name}>
                    <td className="af-batch-td">
                      <div className="af-batch-name">{b.name}</div>
                      <div className="af-batch-bar">
                        <div
                          className="af-batch-bar-fill"
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="af-batch-td">
                      <span className="af-batch-count">{b.count}</span>
                    </td>
                    <td className="af-batch-td">
                      <span
                        className="af-batch-rating-badge"
                        style={{
                          background:
                            b.rating >= 4
                              ? "rgba(34,197,94,0.12)"
                              : "rgba(245,158,11,0.12)",
                          color: b.rating >= 4 ? "#4ade80" : "#fcd34d",
                        }}
                      >
                        {b.rating || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tags */}
          <div className="af-panel">
            <p className="af-panel-title">Top Feedback Tags</p>
            <div className="af-tags-cloud">
              {tagStats.map((t, i) => {
                const c = TAG_COLORS[i % TAG_COLORS.length];
                return (
                  <span
                    key={t.text}
                    className="af-tag"
                    style={{
                      background: c.bg,
                      color: c.color,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    {t.text}
                  </span>
                );
              })}
            </div>
            <div className="af-divider" />
            <p className="af-section-mini-title">Improvement Requests</p>
            {[
              ["🎥 Recorded sessions", "+12%", "amber"],
              ["💬 Weekend doubt sessions", "+8%", "blue"],
              ["📝 Better notes", "+5%", "blue"],
            ].map(([t, v, c]) => (
              <div key={t} className="af-improve-row">
                <span className="af-improve-label">{t}</span>
                <span
                  className="af-improve-badge"
                  style={{
                    background:
                      c === "amber"
                        ? "rgba(245,158,11,0.12)"
                        : "rgba(99,102,241,0.12)",
                    color: c === "amber" ? "#fcd34d" : "#a5b4fc",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FULL TABLE */}
        <div className="af-table-wrap">
          <div className="af-table-header">
            <span className="af-table-title">All Feedback</span>
            <div className="af-table-controls">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍  Search by student, batch, trainer..."
                className="af-search"
              />
              <div className="af-filter-btns">
                {[
                  ["all", "All"],
                  ["new", "New"],
                  ["reviewed", "Reviewed"],
                  ["flag", "⚠ Low Rating"],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    className="af-filter-btn"
                    onClick={() => setFilter(v)}
                    style={{
                      border:
                        filter === v
                          ? "1.5px solid rgba(99,102,241,0.4)"
                          : "1.5px solid rgba(255,255,255,0.08)",
                      background:
                        filter === v ? "rgba(99,102,241,0.15)" : "transparent",
                      color: filter === v ? "#a5b4fc" : "#475569",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loadingFeedback ? (
            <div className="af-loading-table">Loading feedback…</div>
          ) : (
            <table className="af-table">
              <thead>
                <tr>
                  {[
                    "Mood",
                    "Batch",
                    "Trainer",
                    "Student",
                    "Overall Avg",
                    "Status",
                    "Date",
                    "",
                  ].map((h) => (
                    <th key={h} className="af-th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => {
                  const a = parseFloat(avg(f));
                  const ac =
                    a >= 4 ? "#4ade80" : a >= 3 ? "#fcd34d" : "#f87171";
                  return (
                    <tr
                      key={f.id}
                      onMouseEnter={(e) =>
                        e.currentTarget
                          .querySelectorAll("td")
                          .forEach(
                            (td) =>
                              (td.style.background = "rgba(255,255,255,0.025)"),
                          )
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget
                          .querySelectorAll("td")
                          .forEach(
                            (td) => (td.style.background = "transparent"),
                          )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td className="af-td" style={{ fontSize: 22 }}>
                        {f.mood}
                      </td>
                      <td className="af-td">
                        <span className="af-td-text">{f.batch}</span>
                      </td>
                      <td className="af-td">
                        <span className="af-td-sub">{f.trainer}</span>
                      </td>
                      <td className="af-td">
                        <span className="af-td-sub">{f.student}</span>
                      </td>
                      <td className="af-td">
                        <span className="af-avg-badge" style={{ color: ac }}>
                          {avg(f)}
                        </span>
                      </td>
                      <td className="af-td">
                        <span
                          className="af-status-chip"
                          style={{
                            background:
                              f.status === "REVIEWED"
                                ? "rgba(34,197,94,0.12)"
                                : f.status === "ARCHIVED"
                                  ? "rgba(245,158,11,0.12)"
                                  : "rgba(99,102,241,0.12)",
                            color:
                              f.status === "REVIEWED"
                                ? "#4ade80"
                                : f.status === "ARCHIVED"
                                  ? "#fcd34d"
                                  : "#a5b4fc",
                          }}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td className="af-td">
                        <span className="af-td-sub">{f.date}</span>
                      </td>
                      <td className="af-td">
                        <button
                          className="af-view-btn"
                          onClick={() => {
                            setSelected(f);
                            setActiveTab("overview");
                          }}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loadingFeedback && filtered.length === 0 && (
            <div className="af-empty">
              No feedback found for the current filter.
            </div>
          )}
        </div>
      </div>

      {/* ── DETAIL MODAL (unchanged) ── */}
      {selected && (
        <div className="af-modal-overlay" onClick={() => setSelected(null)}>
          <div className="af-modal" onClick={(e) => e.stopPropagation()}>
            <div className="af-modal-head">
              <span className="af-modal-title">
                Feedback #{selected.id} — {selected.batch}
              </span>
              <button
                className="af-modal-close"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </div>
            <div className="af-tabs">
              {["overview", "ratings", "comment"].map((tab) => (
                <button
                  key={tab}
                  className="af-tab"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background:
                      activeTab === tab
                        ? "rgba(99,102,241,0.15)"
                        : "transparent",
                    color: activeTab === tab ? "#a5b4fc" : "#475569",
                    border: "none",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === "overview" && (
              <div className="af-overview-grid">
                {[
                  ["Student", selected.student],
                  ["Trainer", selected.trainer],
                  ["Batch", selected.batch],
                  ["Mood", `${selected.mood}`],
                  ["Status", selected.status],
                  ["Date", selected.date],
                  ["Overall Avg", `${avg(selected)} / 5.0`],
                  [
                    "Anonymous",
                    selected.student === "Anonymous" ? "Yes" : "No",
                  ],
                ].map(([l, v]) => (
                  <div key={l} className="af-overview-item">
                    <p className="af-overview-label">{l}</p>
                    <p className="af-overview-val">{v}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "ratings" && (
              <div>
                <RatingBar
                  label="Clarity of explanation"
                  val={selected.clarity}
                />
                <RatingBar label="Doubt clearing" val={selected.doubt} />
                <RatingBar label="Energy & engagement" val={selected.energy} />
                <RatingBar label="Technical depth" val={selected.depth} />
              </div>
            )}
            {activeTab === "comment" && (
              <div>
                <p className="af-section-label">Tags</p>
                <div className="af-modal-tag-wrap">
                  {(selected.tags || []).map((t) => (
                    <span key={t} className="af-modal-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="af-section-label" style={{ marginTop: 16 }}>
                  Comment
                </p>
                {selected.comment ? (
                  <div className="af-modal-comment">"{selected.comment}"</div>
                ) : (
                  <div
                    style={{
                      color: "#334155",
                      fontSize: 13,
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    No comment provided.
                  </div>
                )}
              </div>
            )}
            <div className="af-modal-actions">
              <button
                className="af-modal-btn"
                onClick={() => adminAction("reviewed")}
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1.5px solid rgba(34,197,94,0.3)",
                  color: "#4ade80",
                }}
              >
                ✓ Mark Reviewed
              </button>
              <button
                className="af-modal-btn"
                onClick={() => adminAction("archive")}
                style={{
                  background: "transparent",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  color: "#64748b",
                }}
              >
                📦 Archive
              </button>
              <button
                className="af-modal-btn"
                onClick={() => setSelected(null)}
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1.5px solid rgba(239,68,68,0.3)",
                  color: "#fca5a5",
                }}
              >
                ⚠ Flag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TRAINER MODAL (unchanged) ── */}
      {trainerModal && (
        <div className="af-modal-overlay" onClick={() => setTrainerModal(null)}>
          <div
            className="af-modal"
            style={{ maxWidth: 480 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="af-modal-head">
              <span className="af-modal-title">{trainerModal.name}</span>
              <button
                className="af-modal-close"
                onClick={() => setTrainerModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="af-overview-grid" style={{ marginBottom: 20 }}>
              {[
                ["Total Reviews", trainerModal.total],
                ["Avg Rating", `${trainerModal.rating} / 5.0`],
                ["Active Batches", "2"],
                ["Rank", "#1"],
              ].map(([l, v]) => (
                <div key={l} className="af-overview-item">
                  <p className="af-overview-label">{l}</p>
                  <p className="af-overview-val">{v}</p>
                </div>
              ))}
            </div>
            <RatingBar label="Clarity of explanation" val={4} />
            <RatingBar label="Doubt clearing" val={3} />
            <RatingBar label="Energy & engagement" val={4} />
            <RatingBar label="Technical depth" val={4} />
            <div className="af-modal-actions">
              <button
                className="af-modal-btn"
                onClick={() => setTrainerModal(null)}
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  border: "none",
                  color: "white",
                }}
              >
                Send Appreciation
              </button>
              <button
                className="af-modal-btn"
                onClick={() => setTrainerModal(null)}
                style={{
                  background: "transparent",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  color: "#64748b",
                }}
              >
                View All Sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ✅ CONFIGURE ALERTS MODAL — updated with per-recipient messages ── */}
      {alertModal && (
        <div className="af-modal-overlay" onClick={() => setAlertModal(false)}>
          <div
            className="af-modal"
            style={{ maxWidth: 560 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="af-modal-head">
              <div>
                <span className="af-modal-title">🔔 Configure Alerts</span>
                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    fontFamily: "Arial, sans-serif",
                    marginTop: 4,
                  }}
                >
                  {selectedBatchName}
                </div>
              </div>
              <button
                className="af-modal-close"
                onClick={() => setAlertModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Save status banner */}
            {alertSaveMsg && (
              <div
                className="ac-status-banner"
                style={{
                  background:
                    alertSaveMsg.type === "success"
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(239,68,68,0.1)",
                  border: `1px solid ${alertSaveMsg.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                  color:
                    alertSaveMsg.type === "success" ? "#4ade80" : "#f87171",
                }}
              >
                {alertSaveMsg.text}
              </div>
            )}

            {alertLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#475569",
                  fontSize: 13,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Loading config…
              </div>
            ) : (
              <>
                {/* Trainer email */}
                <p className="ac-section-title" style={{ marginBottom: 10 }}>
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
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    marginBottom: 20,
                    background: "rgba(255,255,255,0.04)",
                    border: "1.5px solid rgba(255,255,255,0.1)",
                    color: "#e2e8f0",
                    fontSize: 13,
                    fontFamily: "Arial, sans-serif",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />

                {/* ✅ UPDATED: Notify recipients — each with its own message textarea */}
                <p className="ac-section-title">Notify Recipients</p>

                {recipientRows.map(
                  ({ key, label, sub, msgKey, msgPlaceholder, icon }) => (
                    <div key={key} className="ac-recipient-block">
                      {/* Toggle row */}
                      <div className="ac-toggle-row">
                        <div>
                          <div className="ac-toggle-label">
                            {icon} {label}
                          </div>
                          <div className="ac-toggle-sub">{sub}</div>
                        </div>
                        <Toggle
                          checked={alertConfig[key]}
                          onChange={(val) =>
                            setAlertConfig((p) => ({ ...p, [key]: val }))
                          }
                        />
                      </div>

                      {/* ✅ Message textarea — only shown when toggle is ON */}
                      {alertConfig[key] && (
                        <div className="ac-msg-wrap">
                          <span className="ac-msg-label">Message to send</span>
                          <textarea
                            className="ac-msg-textarea"
                            rows={3}
                            value={alertConfig[msgKey]}
                            onChange={(e) =>
                              setAlertConfig((p) => ({
                                ...p,
                                [msgKey]: e.target.value,
                              }))
                            }
                            placeholder={msgPlaceholder}
                          />
                        </div>
                      )}
                    </div>
                  ),
                )}

                {/* Low rating alerts */}
                <p className="ac-section-title" style={{ marginTop: 20 }}>
                  Low Rating Alerts
                </p>

                <div className="ac-toggle-row" style={{ marginBottom: 8 }}>
                  <div>
                    <div className="ac-toggle-label">Alert on Low Ratings</div>
                    <div className="ac-toggle-sub">
                      Trigger alert when avg rating drops below threshold
                    </div>
                  </div>
                  <Toggle
                    checked={alertConfig.alertLowRatings}
                    onChange={(val) =>
                      setAlertConfig((p) => ({ ...p, alertLowRatings: val }))
                    }
                  />
                </div>

                {alertConfig.alertLowRatings && (
                  <div className="ac-threshold-row">
                    <div className="ac-threshold-label">
                      Low Rating Threshold
                      <div
                        style={{ fontSize: 11, color: "#475569", marginTop: 2 }}
                      >
                        Alert triggers when avg falls below this value
                      </div>
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
                      className="ac-threshold-input"
                    />
                  </div>
                )}

                {/* Actions */}
                <div
                  className="af-modal-actions"
                  style={{ alignItems: "center" }}
                >
                  <button
                    className="af-modal-btn"
                    onClick={saveAlertConfig}
                    disabled={alertSaving}
                    style={{
                      background: alertSaving
                        ? "rgba(99,102,241,0.3)"
                        : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      border: "none",
                      color: "white",
                    }}
                  >
                    {alertSaving ? "Saving…" : "💾 Save Config"}
                  </button>
                  <button
                    className="af-modal-btn"
                    onClick={() => setAlertModal(false)}
                    style={{
                      background: "transparent",
                      border: "1.5px solid rgba(255,255,255,0.1)",
                      color: "#64748b",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="ac-delete-btn"
                    onClick={handleDeleteAlertConfig}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
