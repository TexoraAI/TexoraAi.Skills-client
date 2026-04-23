
import { useState, useEffect } from "react";
import {
  getMyTrainerFeedbackByBatch,
  getMyTrainerSummary,
  updateFeedbackStatus,
} from "../services/chatService";
import { getTrainerBatches } from "../services/batchService";

const MOCK = [
  {
    id: 1,
    mood: "🤩",
    moodLabel: "Amazing",
    student: "Anonymous",
    clarity: 5,
    doubt: 4,
    energy: 5,
    depth: 4,
    tags: ["Just right", "Great demos"],
    comment: "Best session so far! Loved the Spring Boot deep dive.",
    status: "SUBMITTED",
    date: "Apr 15",
  },
  {
    id: 2,
    mood: "😊",
    moodLabel: "Good",
    student: "Priya M.",
    clarity: 4,
    doubt: 4,
    energy: 4,
    depth: 3,
    tags: ["Just right", "More examples needed"],
    comment: "",
    status: "REVIEWED",
    date: "Apr 15",
  },
  {
    id: 3,
    mood: "😐",
    moodLabel: "Fine",
    student: "Anonymous",
    clarity: 3,
    doubt: 2,
    energy: 3,
    depth: 3,
    tags: ["Too fast"],
    comment: "Needs to slow down during JPA mapping.",
    status: "SUBMITTED",
    date: "Apr 14",
  },
  {
    id: 4,
    mood: "😞",
    moodLabel: "Poor",
    student: "Anonymous",
    clarity: 2,
    doubt: 1,
    energy: 2,
    depth: 2,
    tags: ["Hard to follow", "Too fast"],
    comment: "Couldn't understand the Kafka consumer part at all.",
    status: "SUBMITTED",
    date: "Apr 14",
  },
  {
    id: 5,
    mood: "🤩",
    moodLabel: "Amazing",
    student: "Ravi K.",
    clarity: 5,
    doubt: 5,
    energy: 5,
    depth: 5,
    tags: ["Just right", "Great demos"],
    comment: "Absolutely loved it. Keep it up!",
    status: "REVIEWED",
    date: "Apr 13",
  },
  {
    id: 6,
    mood: "😊",
    moodLabel: "Good",
    student: "Anonymous",
    clarity: 4,
    doubt: 3,
    energy: 4,
    depth: 4,
    tags: ["Notes & resources"],
    comment: "Please share slides after class.",
    status: "SUBMITTED",
    date: "Apr 13",
  },
];

const styles = `
  .tf-root { font-family: Arial, sans-serif; min-height: 100vh; background: #060a14; color: #e2e8f0; }
  .tf-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 70% 50% at 5% 5%, rgba(99,102,241,0.12) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 95% 90%, rgba(168,85,247,0.1) 0%, transparent 55%);
  }
  .tf-main { position: relative; z-index: 1; padding: 2.5rem 3rem; max-width: 1400px; margin: 0 auto; }
  .tf-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem; }
  .tf-header-left h1 { font-size: 1.6rem; font-weight: 800; color: #f8fafc; margin-bottom: 4px; font-family: Arial, sans-serif; }
  .tf-header-left p { font-size: 13px; color: #475569; font-family: Arial, sans-serif; }
  .tf-batch-select {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; padding: 10px 16px;
  }
  .tf-batch-select select {
    background: transparent; border: none; color: #e2e8f0;
    font-family: Arial, sans-serif; font-size: 13px; cursor: pointer; outline: none;
  }
  .tf-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 2rem; }
  .tf-stat-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 22px 20px; position: relative; overflow: hidden;
  }
  .tf-stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    border-radius: 18px 18px 0 0;
  }
  .tf-stat-label { font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; font-family: Arial, sans-serif; }
  .tf-stat-value { font-size: 2.2rem; font-weight: 800; color: #f8fafc; font-family: Arial, sans-serif; margin-bottom: 4px; }
  .tf-stat-sub { font-size: 12px; color: #475569; font-family: Arial, sans-serif; }
  .tf-stat-bar { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.06); margin-top: 14px; overflow: hidden; }
  .tf-stat-fill { height: 100%; border-radius: 2px; }
  .tf-mid-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 2rem; }
  .tf-panel {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 22px;
  }
  .tf-panel-title { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 20px; font-family: Arial, sans-serif; }
  .tf-rating-row { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
  .tf-rating-label { font-size: 12px; color: #64748b; min-width: 160px; font-family: Arial, sans-serif; }
  .tf-rating-track { flex: 1; height: 8px; border-radius: 4px; background: rgba(255,255,255,0.05); overflow: hidden; }
  .tf-rating-fill { height: 100%; border-radius: 4px; }
  .tf-rating-val { font-size: 13px; font-family: Arial, sans-serif; color: #e2e8f0; font-weight: 700; min-width: 24px; text-align: right; }
  .tf-mood-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .tf-mood-emoji { font-size: 22px; width: 30px; text-align: center; }
  .tf-mood-track { flex: 1; height: 10px; border-radius: 5px; background: rgba(255,255,255,0.05); overflow: hidden; }
  .tf-mood-fill { height: 100%; border-radius: 5px; }
  .tf-mood-count { font-size: 13px; color: #64748b; font-family: Arial, sans-serif; min-width: 20px; text-align: right; font-weight: 700; }
  .tf-table-wrap {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
  }
  .tf-table-header { padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .tf-table-title { font-size: 15px; font-weight: 700; color: #f8fafc; font-family: Arial, sans-serif; }
  .tf-filter-btns { display: flex; gap: 8px; }
  .tf-filter-btn {
    padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s;
  }
  .tf-table { width: 100%; border-collapse: collapse; }
  .tf-th {
    padding: 12px 24px; font-size: 10px; font-weight: 700; color: #334155;
    text-transform: uppercase; letter-spacing: 0.07em; text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-family: Arial, sans-serif;
  }
  .tf-td { padding: 14px 24px; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
  .tf-td-text { font-size: 13px; color: #e2e8f0; font-family: Arial, sans-serif; }
  .tf-td-sub { font-size: 12px; color: #475569; font-family: Arial, sans-serif; }
  .tf-status-badge { padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; font-family: Arial, sans-serif; }
  .tf-view-btn {
    padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 600;
    border: 1.5px solid rgba(255,255,255,0.1); background: transparent; color: #64748b;
    cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s;
  }
  .tf-view-btn:hover { border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
  .tf-empty { padding: 3rem; text-align: center; color: #334155; font-size: 13px; font-family: Arial, sans-serif; }
  .tf-loading { display: flex; align-items: center; justify-content: center; height: 200px; color: #475569; font-family: Arial, sans-serif; font-size: 14px; }
  /* Modal */
  .tf-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(14px);
  }
  .tf-modal {
    background: #0d1526; border: 1px solid rgba(99,102,241,0.2);
    border-radius: 24px; padding: 32px; max-width: 560px; width: 92%;
    max-height: 88vh; overflow-y: auto;
  }
  .tf-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .tf-modal-title { font-size: 1.2rem; font-weight: 800; color: #f8fafc; font-family: Arial, sans-serif; }
  .tf-modal-close {
    width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1); color: #64748b; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
  }
  .tf-modal-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .tf-meta-chip {
    padding: 5px 14px; border-radius: 999px; font-size: 11px;
    border: 1px solid rgba(255,255,255,0.08); color: #64748b;
    font-family: Arial, sans-serif; font-weight: 600;
  }
  .tf-modal-section-title {
    font-size: 10px; font-weight: 700; color: #334155; text-transform: uppercase;
    letter-spacing: 0.08em; margin-bottom: 14px; font-family: Arial, sans-serif;
  }
  .tf-modal-rating-row {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
  }
  .tf-modal-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .tf-modal-tag {
    padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600;
    background: rgba(99,102,241,0.12); color: #a5b4fc;
    border: 1px solid rgba(99,102,241,0.25); font-family: Arial, sans-serif;
  }
  .tf-modal-comment {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 16px; font-size: 13px; color: #94a3b8;
    line-height: 1.7; font-style: italic; margin-bottom: 24px; font-family: Arial, sans-serif;
  }
  .tf-modal-actions { display: flex; gap: 10px; }
  .tf-modal-btn {
    flex: 1; padding: 13px; border-radius: 12px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: Arial, sans-serif; transition: all 0.2s;
  }
`;

function avg(f) {
  return ((f.clarity + f.doubt + f.energy + f.depth) / 4).toFixed(1);
}

function StarDisplay({ val, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= val ? "#f59e0b" : "none"}
          stroke={i <= val ? "#f59e0b" : "#1e3a5f"}
          strokeWidth="1.5"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export default function TrainerFeedback() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [feedbackList, setFeedbackList] = useState(MOCK);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    getTrainerBatches()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setBatches(list);
        if (list.length > 0) setSelectedBatchId(list[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;
    setLoadingFeedback(true);
    getMyTrainerFeedbackByBatch(selectedBatchId)
      .then((r) => {
        const moodMap = {
          AMAZING: "🤩",
          GOOD: "😊",
          FINE: "😐",
          OKAY: "😕",
          POOR: "😞",
        };
        setFeedbackList(
          r.data.map((f) => {
            const moodKey = (f.moodRating || "").toUpperCase().trim();
            return {
              id: f.id,
              moodLabel: moodKey,
              mood: moodMap[moodKey] || "😐",
              student: f.studentEmail || "Anonymous",
              clarity: f.trainerClarityRating || 0,
              doubt: f.trainerDoubtClearingRating || 0,
              energy: f.trainerEnergyRating || 0,
              depth: f.trainerTechnicalDepthRating || 0,
              tags: f.contentTags || [],
              comment: f.comment || "",
              status: f.status,
              date: new Date(f.createdAt).toLocaleDateString(),
            };
          }),
        );
      })
      .catch(() => {
        setFeedbackList(MOCK);
      })
      .finally(() => setLoadingFeedback(false));
  }, [selectedBatchId]);

  const filtered = feedbackList.filter((f) => {
    if (filter === "positive") return f.clarity >= 4 && f.doubt >= 4;
    if (filter === "negative") return f.clarity <= 3 || f.doubt <= 2;
    return true;
  });

  async function handleMarkReviewed(f) {
    try {
      await updateFeedbackStatus(f.id, "REVIEWED");
    } catch {}
    setFeedbackList((prev) =>
      prev.map((x) => (x.id === f.id ? { ...x, status: "REVIEWED" } : x)),
    );
    setSelected(null);
  }

  const moodCounts = [5, 4, 3, 2, 1].map((v) => ({
    icon: ["🤩", "😊", "😐", "😕", "😞"][5 - v],
    count: feedbackList.filter(
      (f) =>
        (({ AMAZING: 5, GOOD: 4, FINE: 3, OKAY: 2, POOR: 1 })[f.moodLabel] ||
          0) === v,
    ).length,
    max: feedbackList.length || 1,
  }));

  const moodBarColors = [
    "linear-gradient(90deg,#6366f1,#a78bfa)",
    "linear-gradient(90deg,#22c55e,#4ade80)",
    "#eab308",
    "#f97316",
    "#ef4444",
  ];

  const statAvg = feedbackList.length
    ? (
        feedbackList.reduce((s, f) => s + parseFloat(avg(f)), 0) /
        feedbackList.length
      ).toFixed(1)
    : "—";
  const anonymousCount = feedbackList.filter(
    (f) => f.student === "Anonymous",
  ).length;
  const anonPct = feedbackList.length
    ? Math.round((anonymousCount / feedbackList.length) * 100)
    : 0;
  const clarityAvg = feedbackList.length
    ? (
        feedbackList.reduce((s, f) => s + f.clarity, 0) / feedbackList.length
      ).toFixed(1)
    : 0;
  const doubtAvg = feedbackList.length
    ? (
        feedbackList.reduce((s, f) => s + f.doubt, 0) / feedbackList.length
      ).toFixed(1)
    : 0;
  const energyAvg = feedbackList.length
    ? (
        feedbackList.reduce((s, f) => s + f.energy, 0) / feedbackList.length
      ).toFixed(1)
    : 0;
  const depthAvg = feedbackList.length
    ? (
        feedbackList.reduce((s, f) => s + f.depth, 0) / feedbackList.length
      ).toFixed(1)
    : 0;

  const stats = [
    {
      label: "Total Feedback",
      value: feedbackList.length,
      sub: "+6 this week",
      fill: "80%",
      color: "#6366f1",
      accent: "#6366f1",
    },
    {
      label: "Overall Rating",
      value: statAvg,
      sub: "Out of 5.0",
      fill: `${(parseFloat(statAvg) / 5) * 100}%`,
      color: "#22c55e",
      accent: "#22c55e",
    },
    {
      label: "Avg Mood Score",
      value: "3.9",
      sub: "🤩 38% Amazing",
      fill: "78%",
      color: "#f59e0b",
      accent: "#f59e0b",
    },
    {
      label: "Anonymous Rate",
      value: `${anonPct}%`,
      sub: `${anonymousCount} anonymous`,
      fill: `${anonPct}%`,
      color: "#8b5cf6",
      accent: "#8b5cf6",
    },
  ];

  const ratingRows = [
    {
      label: "Clarity of explanation",
      val: parseFloat(clarityAvg),
      color: "#22c55e",
    },
    { label: "Doubt clearing", val: parseFloat(doubtAvg), color: "#6366f1" },
    {
      label: "Energy & engagement",
      val: parseFloat(energyAvg),
      color: "#f59e0b",
    },
    { label: "Technical depth", val: parseFloat(depthAvg), color: "#8b5cf6" },
  ];

  return (
    <div className="tf-root">
      <style>{styles}</style>
      <div className="tf-bg" />
      <div className="tf-main">
        {/* HEADER */}
        <div className="tf-header">
          <div className="tf-header-left">
            <h1>Feedback Dashboard</h1>
            <p>Aggregated student feedback for your sessions</p>
          </div>
          <div className="tf-batch-select">
            <span>📦</span>
            <select
              value={selectedBatchId ?? ""}
              onChange={(e) => setSelectedBatchId(Number(e.target.value))}
            >
              {batches.length === 0 && (
                <option value="">No batches assigned</option>
              )}
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name || `Batch #${b.id}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loadingFeedback ? (
          <div className="tf-loading">Loading feedback…</div>
        ) : (
          <>
            {/* STATS */}
            <div className="tf-stats-grid">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="tf-stat-card"
                  style={{ "--accent": s.accent }}
                >
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
                  <p className="tf-stat-label">{s.label}</p>
                  <p className="tf-stat-value">{s.value}</p>
                  <p className="tf-stat-sub">{s.sub}</p>
                  <div className="tf-stat-bar">
                    <div
                      className="tf-stat-fill"
                      style={{ width: s.fill, background: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* MID PANELS */}
            <div className="tf-mid-grid">
              <div className="tf-panel">
                <p className="tf-panel-title">Rating Breakdown</p>
                {ratingRows.map((r) => (
                  <div key={r.label} className="tf-rating-row">
                    <span className="tf-rating-label">{r.label}</span>
                    <div className="tf-rating-track">
                      <div
                        className="tf-rating-fill"
                        style={{
                          width: `${(r.val / 5) * 100}%`,
                          background: r.color,
                        }}
                      />
                    </div>
                    <span className="tf-rating-val">{r.val}</span>
                  </div>
                ))}
              </div>
              <div className="tf-panel">
                <p className="tf-panel-title">Mood Distribution</p>
                {moodCounts.map((m, i) => (
                  <div key={i} className="tf-mood-row">
                    <span className="tf-mood-emoji">{m.icon}</span>
                    <div className="tf-mood-track">
                      <div
                        className="tf-mood-fill"
                        style={{
                          width: `${(m.count / m.max) * 100}%`,
                          background: moodBarColors[i],
                        }}
                      />
                    </div>
                    <span className="tf-mood-count">{m.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TABLE */}
            <div className="tf-table-wrap">
              <div className="tf-table-header">
                <span className="tf-table-title">Recent Feedback</span>
                <div className="tf-filter-btns">
                  {[
                    ["all", "All"],
                    ["positive", "Positive"],
                    ["negative", "Needs Attention"],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      className="tf-filter-btn"
                      onClick={() => setFilter(v)}
                      style={{
                        border:
                          filter === v
                            ? "1.5px solid rgba(99,102,241,0.4)"
                            : "1.5px solid rgba(255,255,255,0.08)",
                        background:
                          filter === v
                            ? "rgba(99,102,241,0.15)"
                            : "transparent",
                        color: filter === v ? "#a5b4fc" : "#475569",
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <table className="tf-table">
                <thead>
                  <tr>
                    {[
                      "Mood",
                      "Student",
                      "Trainer Rating",
                      "Status",
                      "Date",
                      "",
                    ].map((h) => (
                      <th key={h} className="tf-th">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((f) => (
                    <tr
                      key={f.id}
                      onMouseEnter={(e) =>
                        e.currentTarget
                          .querySelectorAll("td")
                          .forEach(
                            (td) =>
                              (td.style.background = "rgba(255,255,255,0.03)"),
                          )
                      }
                      onMouseLeave={(e) =>
                        e.currentTarget
                          .querySelectorAll("td")
                          .forEach(
                            (td) => (td.style.background = "transparent"),
                          )
                      }
                    >
                      <td className="tf-td" style={{ fontSize: 22 }}>
                        {f.mood}
                      </td>
                      <td className="tf-td">
                        <span className="tf-td-text">{f.student}</span>
                      </td>
                      <td className="tf-td">
                        <StarDisplay
                          val={Math.round(parseFloat(avg(f)))}
                          size={14}
                        />
                      </td>
                      <td className="tf-td">
                        <span
                          className="tf-status-badge"
                          style={{
                            background:
                              f.status === "REVIEWED"
                                ? "rgba(34,197,94,0.12)"
                                : "rgba(99,102,241,0.12)",
                            color:
                              f.status === "REVIEWED" ? "#4ade80" : "#a5b4fc",
                          }}
                        >
                          {f.status === "REVIEWED" ? "Reviewed" : "New"}
                        </span>
                      </td>
                      <td className="tf-td">
                        <span className="tf-td-sub">{f.date}</span>
                      </td>
                      <td className="tf-td">
                        <button
                          className="tf-view-btn"
                          onClick={() => setSelected(f)}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="tf-empty">
                  No feedback found for the selected filter.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="tf-modal-overlay" onClick={() => setSelected(null)}>
          <div className="tf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tf-modal-head">
              <span className="tf-modal-title">
                Feedback from {selected.student}
              </span>
              <button
                className="tf-modal-close"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </div>
            <div className="tf-modal-meta">
              {[
                `${selected.mood} ${selected.moodLabel}`,
                `📅 ${selected.date}`,
                ...(selected.student === "Anonymous" ? ["🔒 Anonymous"] : []),
              ].map((t) => (
                <span key={t} className="tf-meta-chip">
                  {t}
                </span>
              ))}
            </div>

            <p className="tf-modal-section-title">Trainer Ratings</p>
            {[
              ["Clarity of explanation", selected.clarity],
              ["Doubt clearing", selected.doubt],
              ["Energy & engagement", selected.energy],
              ["Technical depth", selected.depth],
            ].map(([l, v]) => (
              <div key={l} className="tf-modal-rating-row">
                <span
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {l}
                </span>
                <StarDisplay val={v} size={18} />
              </div>
            ))}

            {selected.tags.length > 0 && (
              <>
                <p className="tf-modal-section-title" style={{ marginTop: 20 }}>
                  Content Tags
                </p>
                <div className="tf-modal-tags">
                  {selected.tags.map((t) => (
                    <span key={t} className="tf-modal-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}

            {selected.comment && (
              <>
                <p className="tf-modal-section-title">Comment</p>
                <div className="tf-modal-comment">"{selected.comment}"</div>
              </>
            )}

            <div className="tf-modal-actions">
              <button
                className="tf-modal-btn"
                onClick={() => handleMarkReviewed(selected)}
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1.5px solid rgba(34,197,94,0.3)",
                  color: "#4ade80",
                }}
              >
                ✓ Mark as Reviewed
              </button>
              <button
                className="tf-modal-btn"
                onClick={() => setSelected(null)}
                style={{
                  background: "transparent",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                  color: "#64748b",
                }}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
