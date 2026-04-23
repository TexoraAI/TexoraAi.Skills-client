
import { useState, useEffect } from "react";
import {
  getStudentContext,
  submitFeedback,
  checkFeedbackStatus,
} from "../services/chatService";

const MOODS = [
  { icon: "😞", label: "Poor", value: "POOR" },
  { icon: "😕", label: "Okay", value: "OKAY" },
  { icon: "😐", label: "Fine", value: "FINE" },
  { icon: "😊", label: "Good", value: "GOOD" },
  { icon: "🤩", label: "Amazing", value: "AMAZING" },
];

const TRAINER_DIMS = [
  { key: "trainerClarityRating", label: "Clarity of explanation" },
  { key: "trainerDoubtClearingRating", label: "Doubt clearing" },
  { key: "trainerEnergyRating", label: "Energy & engagement" },
  { key: "trainerTechnicalDepthRating", label: "Technical depth" },
];

const CONTENT_TAGS = [
  "Too fast",
  "Too slow",
  "Just right",
  "Hard to follow",
  "Very clear",
  "Needs more examples",
  "Great real-world demos",
  "Outdated material",
];

const IMPROVE_TAGS = [
  "More practice time",
  "Better code examples",
  "Recorded sessions",
  "Q&A time",
  "Notes & resources",
  "Smaller batches",
  "Weekend doubt sessions",
];

/* ── Toast Notification ───────────────────────────────────────── */
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100]
                   rounded-xl px-6 py-4 text-sm font-medium shadow-2xl
                   animate-in fade-in slide-in-from-bottom-4 duration-300"
      style={{
        background: type === "success" ? "#10b981" : "#ef4444",
        color: "white",
        animation: "slideInUp 0.3s ease-out",
      }}
    >
      {type === "success" ? "✅" : "⚠️"} {message}
    </div>
  );
}

/* ── Page Transition Wrapper ───────────────────────────────────── */
function PageTransition({ isActive, children }) {
  return (
    <div
      style={{
        animation: isActive
          ? "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "popOut 0.3s ease-in",
        transformOrigin: "center",
      }}
    >
      <style>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes popOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.85) translateY(20px);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
      {children}
    </div>
  );
}

/* ── Star rating row ───────────────────────────────────────────── */
function StarRow({ label, value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-slate-300 min-w-[170px]">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            onClick={() => onChange(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer transition-all duration-200"
            style={{
              transform:
                (hover || value) >= i
                  ? "scale(1.2) rotate(10deg)"
                  : "scale(1) rotate(0deg)",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={(hover || value) >= i ? "#f59e0b" : "none"}
              stroke={(hover || value) >= i ? "#f59e0b" : "#2a3a55"}
              strokeWidth="1.5"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Chip ──────────────────────────────────────────────────────── */
function Chip({ label, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="rounded-full px-3 py-1.5 text-xs transition-all cursor-pointer duration-200"
      style={{
        border: `1.5px solid ${selected ? "#5b8dee" : "#2a3a55"}`,
        background: selected ? "rgba(91,141,238,.15)" : "#1a2235",
        color: selected ? "#5b8dee" : "#94a3b8",
        fontWeight: selected ? 600 : 400,
        transform: selected ? "scale(1.05)" : "scale(1)",
        boxShadow: selected ? "0 4px 12px rgba(91,141,238,.2)" : "none",
      }}
    >
      {label}
    </button>
  );
}

/* ── Card ──────────────────────────────────────────────────────── */
function Card({ title, sub, children }) {
  return (
    <div
      className="rounded-2xl p-6 mb-4 transition-all duration-300"
      style={{
        background: "#111827",
        border: "1px solid #1f2d45",
        backdropFilter: "blur(10px)",
      }}
    >
      {title && (
        <p className="text-sm font-semibold text-slate-200 mb-1">{title}</p>
      )}
      {sub && <p className="text-xs text-slate-400 mb-4">{sub}</p>}
      {children}
    </div>
  );
}

/* ── Nav row ───────────────────────────────────────────────────── */
function NavRow({ onBack, onNext, nextLabel = "Continue →" }) {
  const [nextHover, setNextHover] = useState(false);

  return (
    <div className="flex gap-2.5 mt-6">
      {onBack && (
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-sm text-slate-400 cursor-pointer transition-all duration-200 hover:text-slate-200"
          style={{
            border: "1px solid #2a3a55",
            background: "transparent",
            transform: nextHover ? "none" : "translateX(0)",
          }}
        >
          ← Back
        </button>
      )}
      {onNext && (
        <button
          onMouseEnter={() => setNextHover(true)}
          onMouseLeave={() => setNextHover(false)}
          onClick={onNext}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-200"
          style={{
            border: "none",
            background: nextHover
              ? "linear-gradient(135deg,#7c3aed,#5b8dee)"
              : "linear-gradient(135deg,#5b8dee,#7c3aed)",
            transform: nextHover
              ? "scale(1.02) translateY(-2px)"
              : "scale(1) translateY(0)",
            boxShadow: nextHover ? "0 8px 20px rgba(91,141,238,.3)" : "none",
          }}
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}

/* ── Modal ─────────────────────────────────────────────────────── */
function Modal({ onClose, children }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200"
      style={{
        background: "rgba(0,0,0,.65)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[90%] max-w-md rounded-2xl p-8 animate-in zoom-in duration-300"
        style={{
          background: "#111827",
          border: "1px solid #2a3a55",
          animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ──  Page Transition Message ─────���────────────────────────────── */
function PageTransitionMessage({ page, onClose }) {
  const messages = {
    1: "📝 Let's start with your overall experience",
    2: "⭐ Now, let's rate your trainer",
    3: "📚 How was the content?",
    4: "💡 Help us improve with your suggestions",
  };

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div
          className="text-5xl mb-4 animate-bounce"
          style={{ animation: "bounce 0.6s ease-in-out" }}
        >
          {page === 1 && "📝"}
          {page === 2 && "⭐"}
          {page === 3 && "📚"}
          {page === 4 && "💡"}
        </div>
        <p className="text-lg font-bold text-slate-200 mb-2">
          {messages[page]}
        </p>
        <p className="text-xs text-slate-400 mb-5">
          {page === 1 && "Your honest feedback helps us improve"}
          {page === 2 &&
            "Rate each dimension to help us understand your experience"}
          {page === 3 && "Tell us about the content quality and pace"}
          {page === 4 && "Share what would help you learn better"}
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
          style={{
            border: "none",
            background: "linear-gradient(135deg,#5b8dee,#7c3aed)",
          }}
        >
          Got it! Let's go →
        </button>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════ */
export default function StudentFeedback() {
  /* ── context (mirrors Doubts.jsx) ── */
  const [batchId, setBatchId] = useState(null);
  const [trainerEmail, setTrainerEmail] = useState(null);
  const [ctxLoading, setCtxLoading] = useState(true);
  const [ctxError, setCtxError] = useState("");

  // ✅ NEW: Track if student already submitted
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const ctx = await getStudentContext();
        setBatchId(ctx.data.batchId);
        setTrainerEmail(ctx.data.trainerEmail);

        // ✅ Check if student already submitted feedback
        try {
          const statusResponse = await checkFeedbackStatus(ctx.data.batchId);
          setAlreadySubmitted(statusResponse.data.alreadySubmitted);
        } catch (statusError) {
          console.error("Error checking feedback status:", statusError);
          // Don't block the component if check fails
          setAlreadySubmitted(false);
        }
      } catch {
        setCtxError("No classroom assigned. Please contact admin.");
      } finally {
        setCtxLoading(false);
      }
    };
    load();
  }, []);

  /* ── form state ── */
  const [page, setPage] = useState(1);
  const [mood, setMood] = useState("");
  const [stars, setStars] = useState({});
  const [contentTags, setCTags] = useState([]);
  const [difficulty, setDiff] = useState(3);
  const [improveTags, setITags] = useState([]);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPageMessage, setShowPageMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const progress = [20, 40, 60, 80, 100][page - 1];

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  function buildPreviewChips() {
    const chips = [];
    if (mood)
      chips.push({
        text: `Overall: ${mood}`,
        green: ["GOOD", "AMAZING"].includes(mood),
      });
    Object.entries(stars).forEach(([k, v]) => {
      if (v) chips.push({ text: `${k}: ${v}/5`, green: v >= 4 });
    });
    [...contentTags, ...improveTags].forEach((t) => chips.push({ text: t }));
    if (anonymous) chips.push({ text: "🔒 Anonymous" });
    return chips.slice(0, 8);
  }

  function handlePageChange(newPage) {
    setPage(newPage);
    setShowPageMessage(true);
  }

  /* ── submit ── */
  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      await submitFeedback({
        batchId,
        trainerEmail,
        moodRating: mood,
        anonymous,
        trainerClarityRating: stars["Clarity of explanation"] || 0,
        trainerDoubtClearingRating: stars["Doubt clearing"] || 0,
        trainerEnergyRating: stars["Energy & engagement"] || 0,
        trainerTechnicalDepthRating: stars["Technical depth"] || 0,
        contentTags,
        improvementTags: improveTags,
        comment,
      });
      setShowConfirm(false);
      setShowSuccess(true);
      setAlreadySubmitted(true); // ✅ Mark as submitted
      setToast({
        message: "Feedback submitted successfully!",
        type: "success",
      });
    } catch (e) {
      // ✅ Handle 409 Conflict (already submitted)
      if (e?.response?.status === 409) {
        const errorMsg =
          e?.response?.data?.message ||
          "You already submitted feedback for this batch";
        setError(errorMsg);
        setToast({
          message: "❌ " + errorMsg,
          type: "error",
        });
        setAlreadySubmitted(true);
      } else {
        const errorMsg =
          e?.response?.data?.message || "Submission failed. Please try again.";
        setError(errorMsg);
        setToast({
          message: errorMsg,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = ["Overall", "Trainer", "Content", "Suggest", "Done"];

  /* ── loading / error guards ── */
  if (ctxLoading)
    return (
      <div
        className="min-h-screen flex items-center justify-center w-screen"
        style={{
          background: "#0b0f1a",
          color: "#94a3b8",
          fontFamily: "'Sora',sans-serif",
        }}
      >
        <div className="text-center">
          <div
            style={{ animation: "pulse 2s infinite" }}
            className="text-4xl mb-4"
          >
            ⏳
          </div>
          <p>Loading your classroom…</p>
        </div>
      </div>
    );

  if (ctxError)
    return (
      <div
        className="min-h-screen flex items-center justify-center w-screen"
        style={{ background: "#0b0f1a", fontFamily: "'Sora',sans-serif" }}
      >
        <div
          className="text-center p-8 rounded-2xl"
          style={{ background: "#111827", border: "1px solid #1f2d45" }}
        >
          <p className="text-red-400 text-sm">{ctxError}</p>
        </div>
      </div>
    );

  // ✅ NEW: Show if already submitted
  if (alreadySubmitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center w-screen"
        style={{
          background: "#0b0f1a",
          fontFamily: "'Sora',sans-serif",
        }}
      >
        <div
          className="text-center p-12 rounded-2xl max-w-md"
          style={{ background: "#111827", border: "1px solid #1f2d45" }}
        >
          <div className="text-5xl mb-4">✅</div>
          <p className="text-xl font-bold text-slate-200 mb-3">
            Feedback Already Submitted
          </p>
          <p className="text-sm text-slate-400 mb-6">
            You have already submitted your feedback for Batch #{batchId}.
          </p>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            📌 <strong>Note:</strong> You can only submit feedback once per
            batch to ensure fair and honest feedback.
          </p>
          <div
            className="px-4 py-3 rounded-xl mb-6"
            style={{ background: "#1a2235", border: "1px solid #2a3a55" }}
          >
            <p className="text-xs text-slate-300">
              <strong>Trainer:</strong> {trainerEmail?.split("@")[0]}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
            style={{
              border: "none",
              background: "linear-gradient(135deg,#5b8dee,#7c3aed)",
            }}
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0b0f1a",
        minHeight: "100vh",
        width: "100vw",
        fontFamily: "'Sora',sans-serif",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "auto",
      }}
    >
      {/* Full coverage background mesh */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
          background: `
          radial-gradient(ellipse 100% 80% at 50% 0%,rgba(91,141,238,.12) 0%,transparent 50%),
          radial-gradient(ellipse 80% 100% at 0% 50%,rgba(124,58,237,.10) 0%,transparent 50%),
          radial-gradient(ellipse 80% 100% at 100% 50%,rgba(91,141,238,.08) 0%,transparent 50%),
          radial-gradient(ellipse 100% 80% at 50% 100%,rgba(124,58,237,.09) 0%,transparent 50%)`,
        }}
      />

      {/* Scrollable content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem 1.5rem",
        }}
      >
        {/* Topbar */}
        <div className="flex items-center justify-center mb-8 w-full">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center
                            text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#5b8dee,#7c3aed)" }}
            >
              L
            </div>
            <span className="text-sm font-semibold text-slate-200">
              LMS Portal
              <span className="text-slate-400 font-normal ml-1.5 text-xs">
                / Feedback
              </span>
            </span>
          </div>
        </div>

        {/* Main content container - centered */}
        <div
          style={{
            maxWidth: "750px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {/* Batch banner — data from context */}
          <div
            className="flex items-center justify-between rounded-2xl px-4 py-3 mb-8"
            style={{ background: "#111827", border: "1px solid #1f2d45" }}
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Trainer
              </p>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">
                {trainerEmail?.split("@")[0] || "—"}
              </p>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "rgba(91,141,238,.15)",
                border: "1px solid rgba(91,141,238,.3)",
                color: "#5b8dee",
              }}
            >
              Batch #{batchId}
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="h-0.5 rounded mb-10 overflow-hidden"
            style={{ background: "#1f2d45" }}
          >
            <div
              className="h-full rounded transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg,#5b8dee,#7c3aed)",
              }}
            />
          </div>

          {/* Step dots */}
          <div className="flex items-center mb-10 w-full">
            {stepLabels.map((lbl, idx) => {
              const n = idx + 1;
              const isActive = n === page;
              const isDone = n < page;
              return (
                <div key={n} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center
                                  text-xs font-semibold transition-all duration-300"
                      style={{
                        border: `2px solid ${isDone ? "#10b981" : isActive ? "#5b8dee" : "#2a3a55"}`,
                        background: isDone
                          ? "#10b981"
                          : isActive
                            ? "rgba(91,141,238,.12)"
                            : "#111827",
                        color: isDone
                          ? "#fff"
                          : isActive
                            ? "#5b8dee"
                            : "#64748b",
                        boxShadow: isActive
                          ? "0 0 0 4px rgba(91,141,238,.12)"
                          : "none",
                        transform: isActive ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      {isDone ? "✓" : n}
                    </div>
                    <span
                      className="text-[10px] whitespace-nowrap transition-colors"
                      style={{ color: isActive ? "#5b8dee" : "#64748b" }}
                    >
                      {lbl}
                    </span>
                  </div>
                  {idx < stepLabels.length - 1 && (
                    <div
                      className="flex-1 h-0.5 -mt-4 transition-colors duration-300"
                      style={{ background: n < page ? "#10b981" : "#1f2d45" }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── PAGE 1 — Overall mood ── */}
          <PageTransition isActive={page === 1}>
            {page === 1 && (
              <>
                <Card
                  title="How was this session overall?"
                  sub="Pick the one that matches your feeling"
                >
                  <div className="grid grid-cols-5 gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => {
                          setMood(m.value);
                          setToast({
                            message: `You selected ${m.label}! 👍`,
                            type: "success",
                          });
                        }}
                        className="rounded-2xl py-3 flex flex-col items-center gap-1.5
                                   cursor-pointer transition-all duration-200"
                        style={{
                          border: `1.5px solid ${mood === m.value ? "#5b8dee" : "#2a3a55"}`,
                          background:
                            mood === m.value
                              ? "rgba(91,141,238,.15)"
                              : "#1a2235",
                          transform:
                            mood === m.value
                              ? "translateY(-4px) scale(1.05)"
                              : "none",
                          boxShadow:
                            mood === m.value
                              ? "0 8px 16px rgba(91,141,238,.2)"
                              : "none",
                        }}
                      >
                        <span className="text-2xl">{m.icon}</span>
                        <span
                          className="text-[10px] font-medium"
                          style={{
                            color: mood === m.value ? "#5b8dee" : "#94a3b8",
                          }}
                        >
                          {m.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>
                <NavRow onNext={() => handlePageChange(2)} />
              </>
            )}
          </PageTransition>

          {/* ── PAGE 2 — Trainer ratings ── */}
          <PageTransition isActive={page === 2}>
            {page === 2 && (
              <>
                <Card
                  title="Rate your trainer"
                  sub="Tap a star for each dimension"
                >
                  {TRAINER_DIMS.map(({ key, label }) => (
                    <StarRow
                      key={key}
                      label={label}
                      value={stars[label] || 0}
                      onChange={(v) => {
                        setStars((p) => ({ ...p, [label]: v }));
                        setToast({
                          message: `${label}: ${v}/5 ⭐`,
                          type: "success",
                        });
                      }}
                    />
                  ))}
                </Card>
                <NavRow
                  onBack={() => handlePageChange(1)}
                  onNext={() => handlePageChange(3)}
                />
              </>
            )}
          </PageTransition>

          {/* ── PAGE 3 — Content tags ── */}
          <PageTransition isActive={page === 3}>
            {page === 3 && (
              <>
                <Card
                  title="How was the content?"
                  sub="Select all that describe it"
                >
                  <div className="flex flex-wrap gap-2">
                    {CONTENT_TAGS.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        selected={contentTags.includes(t)}
                        onToggle={() => {
                          toggleArr(contentTags, setCTags, t);
                          setToast({
                            message: contentTags.includes(t)
                              ? `Removed "${t}"`
                              : `Added "${t}"`,
                            type: "success",
                          });
                        }}
                      />
                    ))}
                  </div>
                </Card>
                <Card
                  title="Session difficulty"
                  sub="How challenging was the material?"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Easy</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={difficulty}
                      onChange={(e) => setDiff(Number(e.target.value))}
                      className="flex-1"
                      style={{ accentColor: "#5b8dee" }}
                    />
                    <span className="text-xs text-slate-400">Hard</span>
                    <span className="font-mono text-sm text-blue-400 min-w-[16px] font-bold">
                      {difficulty}
                    </span>
                  </div>
                </Card>
                <NavRow
                  onBack={() => handlePageChange(2)}
                  onNext={() => handlePageChange(4)}
                />
              </>
            )}
          </PageTransition>

          {/* ── PAGE 4 — Suggestions + comment ── */}
          <PageTransition isActive={page === 4}>
            {page === 4 && (
              <>
                <Card
                  title="What would help most?"
                  sub="Pick your top suggestions"
                >
                  <div className="flex flex-wrap gap-2">
                    {IMPROVE_TAGS.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        selected={improveTags.includes(t)}
                        onToggle={() => {
                          toggleArr(improveTags, setITags, t);
                          setToast({
                            message: improveTags.includes(t)
                              ? `Removed suggestion`
                              : `Added suggestion`,
                            type: "success",
                          });
                        }}
                      />
                    ))}
                  </div>
                </Card>

                <Card>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-widest
                                text-slate-500 mb-2.5"
                  >
                    Your comments (optional)
                  </p>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Anything specific for the trainer or admin team…"
                    className="w-full rounded-xl px-3.5 py-3 text-sm text-slate-200
                               placeholder-slate-500 resize-none outline-none"
                    style={{
                      background: "#1a2235",
                      border: "1px solid #2a3a55",
                      fontFamily: "inherit",
                      lineHeight: 1.6,
                    }}
                  />

                  {/* Anonymous toggle */}
                  <div
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 mt-3 cursor-pointer"
                    onClick={() => setAnonymous(!anonymous)}
                    style={{
                      background: "#1a2235",
                      border: "1px solid #1f2d45",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      className="w-10 h-6 rounded-full relative transition-all duration-200"
                      style={{ background: anonymous ? "#5b8dee" : "#2a3a55" }}
                    >
                      <div
                        className="w-[18px] h-[18px] rounded-full bg-white absolute top-[3px]
                                  transition-all duration-200"
                        style={{ left: anonymous ? "19px" : "3px" }}
                      />
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      <strong className="text-slate-200">
                        Submit anonymously
                      </strong>
                      <br />
                      Trainer sees your feedback but not your name
                    </div>
                  </div>
                </Card>

                {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

                <NavRow
                  onBack={() => handlePageChange(3)}
                  onNext={() => setShowConfirm(true)}
                  nextLabel="Submit feedback"
                />
              </>
            )}
          </PageTransition>

          {/* Extra spacing for bottom */}
          <div style={{ height: "2rem" }} />
        </div>
      </div>

      {/* ── Confirm modal ── */}
      {showConfirm && (
        <Modal onClose={() => setShowConfirm(false)}>
          <div className="text-center">
            <div
              className="text-5xl mb-3"
              style={{ animation: "bounce 0.6s ease-in-out" }}
            >
              📋
            </div>
            <p className="text-lg font-bold text-slate-200 mb-2">
              Ready to submit?
            </p>
            <p className="text-xs text-slate-400 mb-5">
              You can't edit it after submission.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-4 max-h-40 overflow-y-auto">
              {buildPreviewChips().map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                  style={{
                    background: c.green
                      ? "rgba(16,185,129,.15)"
                      : "rgba(91,141,238,.15)",
                    color: c.green ? "#10b981" : "#5b8dee",
                    border: `1px solid ${c.green ? "rgba(16,185,129,.3)" : "rgba(91,141,238,.3)"}`,
                  }}
                >
                  {c.text}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 mb-5">
              {anonymous
                ? "🔒 Submitting anonymously"
                : "👤 Submitting with your name"}
            </p>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white
                         cursor-pointer transition-all duration-200"
              style={{
                border: "none",
                background: "linear-gradient(135deg,#5b8dee,#7c3aed)",
                opacity: loading ? 0.6 : 1,
                transform: loading ? "scale(0.98)" : "scale(1)",
              }}
            >
              {loading ? "Submitting…" : "Confirm & Submit"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="w-full mt-2.5 py-2.5 rounded-xl text-sm text-slate-400 cursor-pointer transition-all"
              style={{
                border: "1px solid #2a3a55",
                background: "transparent",
              }}
            >
              Go back
            </button>
          </div>
        </Modal>
      )}

      {/* ── Success modal ── */}
      {showSuccess && (
        <Modal onClose={() => setShowSuccess(false)}>
          <div className="text-center">
            <div
              className="text-5xl mb-3"
              style={{ animation: "bounce 0.6s ease-in-out" }}
            >
              ✅
            </div>
            <p className="text-lg font-bold text-slate-200 mb-2">
              Feedback submitted!
            </p>
            <p className="text-xs text-slate-400 mb-5">
              Your input helps improve every batch.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-5 max-h-40 overflow-y-auto">
              {buildPreviewChips().map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                  style={{
                    background: c.green
                      ? "rgba(16,185,129,.15)"
                      : "rgba(91,141,238,.15)",
                    color: c.green ? "#10b981" : "#5b8dee",
                    border: `1px solid ${c.green ? "rgba(16,185,129,.3)" : "rgba(91,141,238,.3)"}`,
                  }}
                >
                  {c.text}
                </span>
              ))}
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
              style={{
                border: "none",
                background: "linear-gradient(135deg,#5b8dee,#7c3aed)",
              }}
            >
              Back to dashboard
            </button>
          </div>
        </Modal>
      )}

      {/* ── Page Transition Message Modal ── */}
      {showPageMessage && (
        <PageTransitionMessage
          page={page}
          onClose={() => setShowPageMessage(false)}
        />
      )}

      {/* ── Toast Notification ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
