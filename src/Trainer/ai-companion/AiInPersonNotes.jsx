import { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  Square,
  Copy,
  Check,
  FileText,
  MessageSquare,
  Loader2,
  AlertCircle,
  Sparkles,
  Send,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

// ── Inline API helpers (avoid circular import issues) ─────────────────────────
const API_BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:9000/api";

const authHeaders = () => {
  const token = localStorage.getItem("lms_token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const api = {
  startTranscript: (data = {}) =>
    axios.post(
      `${API_BASE}/v1/ai-companion/transcripts/start`,
      data,
      authHeaders(),
    ),
  addSegment: (tid, data) =>
    axios.post(
      `${API_BASE}/v1/ai-companion/transcripts/${tid}/segment`,
      data,
      authHeaders(),
    ),
  stopTranscript: (tid) =>
    axios.post(
      `${API_BASE}/v1/ai-companion/transcripts/${tid}/stop`,
      {},
      authHeaders(),
    ),
  getSummary: (tid) =>
    axios.post(
      `${API_BASE}/v1/ai-companion/transcripts/${tid}/summary`,
      {},
      authHeaders(),
    ),
  ask: (tid, question) =>
    axios.post(
      `${API_BASE}/v1/ai-companion/transcripts/${tid}/ask`,
      { question },
      authHeaders(),
    ),
};

// ── Speech recognition factory ────────────────────────────────────────────────
function createSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";
  return rec;
}

const SPEECH_SUPPORTED = !!(
  window.SpeechRecognition || window.webkitSpeechRecognition
);

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function secondsToTimestamp(sec) {
  if (!sec && sec !== 0) return "";
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AiInPersonNotes({ isDark }) {
  // Theme
  const bg = isDark ? "#0d1117" : "#f0f4f8";
  const panelBg = isDark ? "#111827" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const inputBg = isDark ? "#1a2233" : "#ffffff";
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6";
  const tabActiveBg = isDark ? "rgba(37,99,235,0.15)" : "#eff6ff";

  // State
  const [phase, setPhase] = useState("idle"); // idle | recording | stopped
  const [activeTab, setActiveTab] = useState("transcript"); // transcript | summary
  const [segments, setSegments] = useState([]); // { id, speaker, text, time, second }
  const [interimText, setInterimText] = useState("");
  const [transcriptId, setTranscriptId] = useState(null);
  const [startEpoch, setStartEpoch] = useState(null);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState([]); // { q, a }
  const [qaLoading, setQaLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const recRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [segments, interimText]);

  // ── Start recording ─────────────────────────────────────────────────────────
  const handleStart = useCallback(async () => {
    setError("");

    if (!SPEECH_SUPPORTED) {
      setError(
        "Your browser does not support the Web Speech API. Please use Chrome or Edge.",
      );
      return;
    }

    // Request mic permission early
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError(
        "Microphone access denied. Please allow microphone and try again.",
      );
      return;
    }

    // Create backend session
    let tid;
    try {
      const res = await api.startTranscript({ title: "In-Person Notes" });
      tid = res.data.id;
      setTranscriptId(tid);
    } catch {
      setError("Failed to start transcript session. Check server connection.");
      return;
    }

    const epoch = Date.now();
    setStartEpoch(epoch);
    setSegments([]);
    setInterimText("");
    setSummary("");
    setQaHistory([]);
    setPhase("recording");
    setActiveTab("transcript");

    // Start Web Speech
    const rec = createSpeechRecognition();
    recRef.current = rec;

    rec.onresult = async (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (!text) continue;
          const second = Math.floor((Date.now() - epoch) / 1000);
          const seg = {
            id: Date.now(),
            speaker: "Speaker 1",
            text,
            time: new Date().toISOString(),
            second,
          };
          setSegments((prev) => [...prev, seg]);
          setInterimText("");
          // Persist to backend (fire and forget)
          api
            .addSegment(tid, {
              text,
              speakerName: "Speaker 1",
              startedAtSecond: second,
            })
            .catch(() => {}); // silent fail — don't disrupt UX
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimText(interim);
    };

    rec.onerror = (e) => {
      if (e.error === "not-allowed") {
        setError("Microphone permission denied.");
        setPhase("idle");
      } else if (e.error === "no-speech") {
        // expected, ignore
      } else {
        console.warn("SpeechRecognition error:", e.error);
      }
    };

    rec.onend = () => {
      // Auto-restart if still recording (handles browser auto-stop)
      if (recRef.current && recRef.current._shouldRestart) {
        try {
          rec.start();
        } catch {}
      }
    };

    rec._shouldRestart = true;
    rec.start();
  }, []);

  // ── Stop recording ──────────────────────────────────────────────────────────
  const handleStop = useCallback(async () => {
    if (recRef.current) {
      recRef.current._shouldRestart = false;
      recRef.current.stop();
      recRef.current = null;
    }
    setInterimText("");
    setPhase("stopped");

    if (transcriptId) {
      try {
        await api.stopTranscript(transcriptId);
      } catch {}
      // Auto-generate summary
      setActiveTab("summary");
      setSummaryLoading(true);
      try {
        const res = await api.getSummary(transcriptId);
        setSummary(res.data.summary || "No summary available.");
      } catch {
        setSummary("Could not generate summary. Please try again.");
      } finally {
        setSummaryLoading(false);
      }
    }
  }, [transcriptId]);

  // ── Copy transcript ─────────────────────────────────────────────────────────
  const handleCopy = () => {
    const text = segments
      .map((s) => `[${secondsToTimestamp(s.second)}] ${s.speaker}: ${s.text}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Ask question ────────────────────────────────────────────────────────────
  const handleAsk = async () => {
    if (!question.trim() || !transcriptId || qaLoading) return;
    const q = question.trim();
    setQuestion("");
    setQaLoading(true);
    setQaHistory((prev) => [...prev, { q, a: null }]);
    try {
      const res = await api.ask(transcriptId, q);
      const answer = res.data.answer || "No answer available.";
      setQaHistory((prev) =>
        prev.map((item, i) =>
          i === prev.length - 1 ? { q, a: answer } : item,
        ),
      );
    } catch {
      setQaHistory((prev) =>
        prev.map((item, i) =>
          i === prev.length - 1
            ? { q, a: "Failed to get answer. Try again." }
            : item,
        ),
      );
    } finally {
      setQaLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const hasTranscript = segments.length > 0;
  const canAsk = phase === "stopped" && hasTranscript && transcriptId;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: bg,
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
        height: "100%",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${border}`,
          background: panelBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background:
                phase === "recording"
                  ? "rgba(239,68,68,0.12)"
                  : "rgba(37,99,235,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Mic
              size={16}
              color={phase === "recording" ? "#ef4444" : "#2563eb"}
            />
            {phase === "recording" && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#ef4444",
                  animation: "pulse 1.2s infinite",
                }}
              />
            )}
          </div>
          <div>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: textPrimary,
                margin: 0,
              }}
            >
              In-Person Notes
            </h2>
            <p
              style={{ fontSize: 11, color: textSecondary, margin: "1px 0 0" }}
            >
              {phase === "recording"
                ? "● Recording live…"
                : phase === "stopped"
                  ? "Session complete"
                  : "Transcribe and annotate sessions"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!SPEECH_SUPPORTED && (
            <span
              style={{
                fontSize: 11,
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <AlertCircle size={12} /> Browser not supported
            </span>
          )}
          {phase === "idle" && (
            <button onClick={handleStart} style={btnStyle("#2563eb")}>
              <Mic size={12} /> Start Transcribing
            </button>
          )}
          {phase === "recording" && (
            <button onClick={handleStop} style={btnStyle("#ef4444")}>
              <Square size={11} fill="#fff" /> Stop
            </button>
          )}
          {phase === "stopped" && (
            <button
              onClick={() => {
                setPhase("idle");
                setSegments([]);
                setSummary("");
                setQaHistory([]);
                setTranscriptId(null);
                setActiveTab("transcript");
              }}
              style={{ ...btnStyle("#6b7280"), fontSize: 12 }}
            >
              New Session
            </button>
          )}
        </div>
      </div>

      {/* ── Error banner ─────────────────────────────────────────────────────── */}
      {error && (
        <div
          style={{
            padding: "8px 16px",
            background: "rgba(239,68,68,0.1)",
            borderBottom: `1px solid rgba(239,68,68,0.2)`,
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <AlertCircle size={13} color="#ef4444" />
          <span style={{ fontSize: 12, color: "#ef4444" }}>{error}</span>
          <button
            onClick={() => setError("")}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#ef4444",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Main content split ────────────────────────────────────────────────── */}
      <div
        style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}
      >
        {/* ── Left: Transcript / Summary panel ─────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: `1px solid ${border}`,
            minHeight: 0,
          }}
        >
          {/* Tabs */}
          <div
            style={{
              padding: "0 16px",
              borderBottom: `1px solid ${border}`,
              background: isDark ? "#111827" : "#f9fafb",
              display: "flex",
              gap: 2,
              flexShrink: 0,
            }}
          >
            {["transcript", "summary"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 14px",
                  border: "none",
                  borderBottom:
                    activeTab === tab
                      ? "2px solid #2563eb"
                      : "2px solid transparent",
                  background: "transparent",
                  color: activeTab === tab ? "#2563eb" : textSecondary,
                  fontSize: 12,
                  fontWeight: activeTab === tab ? 600 : 400,
                  fontFamily: "'Poppins', sans-serif",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  transition: "color 0.15s",
                }}
              >
                {tab === "transcript" ? (
                  <FileText size={12} />
                ) : (
                  <Sparkles size={12} />
                )}
                {tab === "transcript" ? "Transcript" : "Summary"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 16px",
              minHeight: 0,
            }}
          >
            {/* ── Transcript tab ─────────────────────────────────────────────── */}
            {activeTab === "transcript" && (
              <>
                {phase === "idle" && !hasTranscript ? (
                  <EmptyState
                    icon={<Mic size={22} color="#2563eb" />}
                    text='Click "Start Transcribing" to begin capturing speech'
                    isDark={isDark}
                    textSecondary={textSecondary}
                  />
                ) : phase === "recording" && !hasTranscript ? (
                  <EmptyState
                    icon={
                      <Loader2
                        size={22}
                        color="#2563eb"
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    }
                    text="Listening… speak clearly near your microphone"
                    isDark={isDark}
                    textSecondary={textSecondary}
                  />
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {segments.map((seg) => (
                      <SegmentRow
                        key={seg.id}
                        seg={seg}
                        isDark={isDark}
                        textPrimary={textPrimary}
                        textSecondary={textSecondary}
                        border={border}
                      />
                    ))}
                    {interimText && (
                      <div
                        style={{
                          padding: "8px 10px",
                          borderRadius: 7,
                          border: `1px dashed ${border}`,
                          color: textSecondary,
                          fontSize: 12,
                          fontStyle: "italic",
                        }}
                      >
                        {interimText}
                      </div>
                    )}
                    <div ref={transcriptEndRef} />
                  </div>
                )}
              </>
            )}

            {/* ── Summary tab ────────────────────────────────────────────────── */}
            {activeTab === "summary" && (
              <>
                {summaryLoading ? (
                  <EmptyState
                    icon={
                      <Loader2
                        size={22}
                        color="#2563eb"
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    }
                    text="Generating AI summary…"
                    isDark={isDark}
                    textSecondary={textSecondary}
                  />
                ) : summary ? (
                  <div
                    style={{
                      padding: "14px",
                      borderRadius: 10,
                      background: isDark ? "#1f2937" : "#f8fafc",
                      border: `1px solid ${border}`,
                      fontSize: 13,
                      color: textPrimary,
                      lineHeight: 1.75,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {summary}
                  </div>
                ) : phase === "stopped" && hasTranscript ? (
                  <div style={{ textAlign: "center", paddingTop: 32 }}>
                    <button
                      onClick={async () => {
                        setSummaryLoading(true);
                        try {
                          const res = await api.getSummary(transcriptId);
                          setSummary(res.data.summary || "No summary.");
                        } catch {
                          setSummary("Failed to generate summary.");
                        } finally {
                          setSummaryLoading(false);
                        }
                      }}
                      style={btnStyle("#2563eb")}
                    >
                      <Sparkles size={12} /> Generate Summary
                    </button>
                  </div>
                ) : (
                  <EmptyState
                    icon={<Sparkles size={22} color="#6b7280" />}
                    text="Stop the session to generate an AI summary"
                    isDark={isDark}
                    textSecondary={textSecondary}
                  />
                )}
              </>
            )}
          </div>

          {/* Footer actions */}
          {hasTranscript && (
            <div
              style={{
                padding: "10px 14px",
                borderTop: `1px solid ${border}`,
                background: isDark ? "#111827" : "#f9fafb",
                display: "flex",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <button
                onClick={handleCopy}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: `1px solid ${border}`,
                  background: "transparent",
                  cursor: "pointer",
                  color: copied ? "#10b981" : textSecondary,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copied!" : "Copy Transcript"}
              </button>
              <span
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  alignSelf: "center",
                }}
              >
                {segments.length} segment{segments.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* ── Right: Ask AI panel ───────────────────────────────────────────── */}
        <div
          style={{
            width: 340,
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: `1px solid ${border}`,
              background: isDark ? "#111827" : "#f9fafb",
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <MessageSquare size={13} color={textSecondary} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: textSecondary,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Ask About Transcript
            </span>
          </div>

          {/* Q&A list */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minHeight: 0,
            }}
          >
            {qaHistory.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 8,
                  textAlign: "center",
                }}
              >
                <MessageSquare
                  size={28}
                  color={isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}
                />
                <span style={{ fontSize: 11, color: textSecondary }}>
                  {canAsk
                    ? "Ask questions about your transcript"
                    : "Questions available after stopping the session"}
                </span>
              </div>
            ) : (
              qaHistory.map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {/* Question bubble */}
                  <div
                    style={{
                      alignSelf: "flex-end",
                      maxWidth: "85%",
                      padding: "8px 11px",
                      borderRadius: "10px 10px 2px 10px",
                      background: "rgba(37,99,235,0.12)",
                      border: "1px solid rgba(37,99,235,0.18)",
                      fontSize: 12,
                      color: textPrimary,
                    }}
                  >
                    {item.q}
                  </div>
                  {/* Answer bubble */}
                  {item.a === null ? (
                    <div
                      style={{
                        alignSelf: "flex-start",
                        padding: "8px 11px",
                        borderRadius: "10px 10px 10px 2px",
                        background: isDark ? "#1f2937" : "#f3f4f6",
                        border: `1px solid ${border}`,
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        fontSize: 12,
                        color: textSecondary,
                      }}
                    >
                      <Loader2
                        size={11}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      Thinking…
                    </div>
                  ) : (
                    <div
                      style={{
                        alignSelf: "flex-start",
                        maxWidth: "90%",
                        padding: "8px 11px",
                        borderRadius: "10px 10px 10px 2px",
                        background: isDark ? "#1f2937" : "#f8fafc",
                        border: `1px solid ${border}`,
                        fontSize: 12,
                        color: textPrimary,
                        lineHeight: 1.65,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: `1px solid ${border}`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
                alignItems: "flex-end",
                padding: "6px 8px 6px 10px",
                borderRadius: 9,
                border: `1px solid ${border}`,
                background: inputBg,
              }}
            >
              <textarea
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!canAsk}
                placeholder={
                  canAsk
                    ? "Ask about the transcript…"
                    : "Available after session ends"
                }
                rows={1}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  color: textPrimary,
                  fontSize: 12,
                  resize: "none",
                  outline: "none",
                  fontFamily: "'Poppins', sans-serif",
                  opacity: canAsk ? 1 : 0.4,
                  lineHeight: 1.5,
                  maxHeight: 80,
                  overflowY: "auto",
                }}
              />
              <button
                onClick={handleAsk}
                disabled={!canAsk || !question.trim() || qaLoading}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  border: "none",
                  background:
                    canAsk && question.trim() && !qaLoading
                      ? "#2563eb"
                      : isDark
                        ? "rgba(255,255,255,0.08)"
                        : "#e5e7eb",
                  cursor:
                    canAsk && question.trim() && !qaLoading
                      ? "pointer"
                      : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.15s",
                }}
              >
                {qaLoading ? (
                  <Loader2
                    size={12}
                    color="#fff"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <Send
                    size={12}
                    color={canAsk && question.trim() ? "#fff" : textSecondary}
                  />
                )}
              </button>
            </div>
            <p
              style={{
                fontSize: 10,
                color: textSecondary,
                marginTop: 4,
                marginBottom: 0,
              }}
            >
              Press Enter to send
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SegmentRow({ seg, isDark, textPrimary, textSecondary, border }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 8,
        background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
        border: `1px solid ${border}`,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(37,99,235,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <span style={{ fontSize: 9, fontWeight: 700, color: "#2563eb" }}>
          S1
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginBottom: 2,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: "#2563eb" }}>
            {seg.speaker}
          </span>
          <span style={{ fontSize: 10, color: textSecondary }}>
            {secondsToTimestamp(seg.second)}
          </span>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: textPrimary,
            lineHeight: 1.6,
          }}
        >
          {seg.text}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ icon, text, textSecondary }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 10,
        textAlign: "center",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(37,99,235,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 12, color: textSecondary, maxWidth: 220 }}>
        {text}
      </span>
    </div>
  );
}

function btnStyle(bg) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    borderRadius: 8,
    border: "none",
    background: bg,
    color: "#fff",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
  };
}

// function secondsToTimestamp(sec) {
//   if (sec === undefined || sec === null) return "";
//   const m = Math.floor(sec / 60).toString().padStart(2, "0");
//   const s = (sec % 60).toString().padStart(2, "0");
//   return `${m}:${s}`;
// }
