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
  Languages,
  RotateCcw,
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
  uploadAudioChunk: (tid, formData) =>
    axios.post(
      `${API_BASE}/v1/ai-companion/transcripts/${tid}/audio-chunk`,
      formData,
      {
        headers: {
          ...authHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      },
    ),
  stopTranscript: (tid) =>
    axios.post(
      `${API_BASE}/v1/ai-companion/transcripts/${tid}/stop`,
      {},
      authHeaders(),
    ),
  getTranscript: (tid) =>
    axios.get(`${API_BASE}/v1/ai-companion/transcripts/${tid}`, authHeaders()),
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
// ── Speech recognition factory ────────────────────────────────────────────────
// Web Speech is now captions-only (fast, low-latency, never saved) — the
// authoritative transcript comes from Whisper audio chunks instead.
function createSpeechRecognition(langCode) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = langCode || "en-US";
  return rec;
}

// ── Supported languages ─────────────────────────────────────────────────────
// code: BCP-47 tag for Web Speech's rec.lang.
// whisper: ISO-639-1 code passed to the Whisper "language" param.
const LANGUAGES = [
  { code: "en-US", whisper: "en", label: "English (US)" },
  { code: "en-GB", whisper: "en", label: "English (UK)" },
  { code: "hi-IN", whisper: "hi", label: "Hindi" },
  { code: "es-ES", whisper: "es", label: "Spanish" },
  { code: "fr-FR", whisper: "fr", label: "French" },
  { code: "de-DE", whisper: "de", label: "German" },
  { code: "te-IN", whisper: "te", label: "Telugu" },
  { code: "ta-IN", whisper: "ta", label: "Tamil" },
];

// Rolling chunk length in seconds — each MediaRecorder cycle produces one
// self-contained, independently-decodable webm blob of roughly this length.
const CHUNK_SECONDS = 45;

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
// export default function AiInPersonNotes({ isDark }) {
export default function AiInPersonNotes({
  isDark,
  initialTranscriptId,
  initialSessionId,
  initialSessionTitle,
  initialReadOnly,
}) {
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
  const [sessionTitle, setSessionTitle] = useState(initialSessionTitle || null);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState([]); // { q, a }
  const [qaLoading, setQaLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [liveCaption, setLiveCaption] = useState(""); // last Web Speech final result — ephemeral, never saved
  const [chunkCount, setChunkCount] = useState(0); // total chunks recorded this session, for the UI

  const recRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const inputRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunkTimerRef = useRef(null);
  const chunkIndexRef = useRef(0);
  const startEpochRef = useRef(null); // mirrors startEpoch but reachable inside closures without stale state

  // Auto-scroll
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [segments, interimText]);

  // ── Upload one rolling audio chunk, authoritative Whisper transcript ──────
  // Retries once on failure; a second failure marks the chunk failed
  // locally (UI-only) without blocking the rest of the recording session.
  const uploadChunk = useCallback(
    async (blob, tid, index, secondAtChunkStart, attempt = 1) => {
      const pendingId = `chunk-pending-${tid}-${index}`;
      setSegments((prev) => [
        ...prev,
        {
          id: pendingId,
          speaker: "Speaker 1",
          text: "",
          time: new Date().toISOString(),
          second: secondAtChunkStart,
          status: "processing",
        },
      ]);

      const formData = new FormData();
      formData.append("file", blob, `chunk_${index}.webm`);
      formData.append("chunkIndex", index);
      formData.append("startedAtSecond", secondAtChunkStart);
      formData.append("language", language.whisper);

      try {
        const res = await api.uploadAudioChunk(tid, formData);
        const saved = res?.data;
        setSegments((prev) =>
          prev
            .map((s) =>
              s.id === pendingId
                ? saved
                  ? {
                      id: saved.id,
                      speaker: saved.speakerName || "Speaker 1",
                      text: saved.text,
                      time: saved.createdAt || new Date().toISOString(),
                      second: saved.startedAtSecond ?? secondAtChunkStart,
                      status: "done",
                    }
                  : null // silence — nothing came back, drop the placeholder
                : s,
            )
            .filter(Boolean),
        );
      } catch (err) {
        if (attempt < 2) {
          await uploadChunk(blob, tid, index, secondAtChunkStart, attempt + 1);
          return;
        }
        setSegments((prev) =>
          prev.map((s) =>
            s.id === pendingId ? { ...s, status: "failed", text: "" } : s,
          ),
        );
      }
    },
    [language],
  );

  // ── Retry a failed chunk manually isn't possible — the audio blob is gone
  // once a cycle ends. Failed rows are dismissible only. ──────────────────
  const dismissFailedSegment = (id) => {
    setSegments((prev) => prev.filter((s) => s.id !== id));
  };

  // ── Rolling MediaRecorder chunk cycle ──────────────────────────────────────
  // Each cycle stops the current recorder (flushing a complete, valid webm
  // blob), uploads it, then starts a fresh MediaRecorder on the same stream
  // for the next window. This avoids the "later timeslice blobs aren't
  // independently decodable" problem of a single long-running recorder.
  const startChunkCycle = useCallback(
    (stream, tid) => {
      const cycle = () => {
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        const localChunks = [];
        const index = chunkIndexRef.current;
        const secondAtStart = startEpochRef.current
          ? Math.floor((Date.now() - startEpochRef.current) / 1000)
          : 0;

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) localChunks.push(e.data);
        };
        recorder.onstop = () => {
          if (localChunks.length > 0) {
            const blob = new Blob(localChunks, { type: "audio/webm" });
            uploadChunk(blob, tid, index, secondAtStart);
          }
          chunkIndexRef.current += 1;
          setChunkCount(chunkIndexRef.current);
        };

        mediaRecorderRef.current = recorder;
        recorder.start();

        chunkTimerRef.current = setTimeout(() => {
          if (
            mediaRecorderRef.current === recorder &&
            recorder.state !== "inactive"
          ) {
            recorder.stop();
          }
          if (mediaStreamRef.current) cycle(); // schedule next cycle
        }, CHUNK_SECONDS * 1000);
      };

      cycle();
    },
    [uploadChunk],
  );

  const stopChunkCycle = useCallback(() => {
    if (chunkTimerRef.current) {
      clearTimeout(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.onstop = (() => {
          const original = recorder.onstop;
          return (e) => {
            if (typeof original === "function") original(e);
            resolve();
          };
        })();
        recorder.stop();
      } else {
        resolve();
      }
    });
  }, []);

  // ── Start recording ─────────────────────────────────────────────────────────
  const handleStart = useCallback(async () => {
    setError("");

    if (!SPEECH_SUPPORTED) {
      setError(
        "Your browser does not support the Web Speech API. Please use Chrome or Edge.",
      );
      return;
    }

    // Request mic permission early, and keep the stream — MediaRecorder
    // reuses it for the Whisper chunk pipeline instead of requesting twice.
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
    } catch {
      setError(
        "Microphone access denied. Please allow microphone and try again.",
      );
      return;
    }

    // Create backend session
    // let tid;
    // try {
    //   const res = await api.startTranscript({ title: "In-Person Notes" });
    //   tid = res.data.id;
    //   setTranscriptId(tid);
    // } catch {
    //   setError("Failed to start transcript session. Check server connection.");
    //   return;
    // }

    // const epoch = Date.now();
    // setStartEpoch(epoch);
    // setSegments([]);
    // setInterimText("");
    // Reuse an existing transcript (e.g. handed off from the Meetings tab)
    // instead of creating a duplicate session — this is the core fix.
    let tid = transcriptId;
    if (!tid) {
      try {
        const res = await api.startTranscript({
          liveSessionId: initialSessionId || null,
          title: sessionTitle || "In-Person Notes",
        });
        tid = res.data.id;
        setTranscriptId(tid);
      } catch {
        setError(
          "Failed to start transcript session. Check server connection.",
        );
        return;
      }
    }

    const epoch = Date.now();
    setStartEpoch(epoch);
    startEpochRef.current = epoch;
    chunkIndexRef.current = 0;
    setChunkCount(0);
    if (!initialTranscriptId) {
      setSegments([]);
    }
    setInterimText("");
    setLiveCaption("");
    setSummary("");
    setQaHistory([]);
    setPhase("recording");
    setActiveTab("transcript");

    // Start Web Speech — captions only now, never saved to the transcript.
    const rec = createSpeechRecognition(language.code);
    recRef.current = rec;

    // Start the Whisper rolling-chunk pipeline on the same mic stream —
    // this becomes the authoritative transcript.
    startChunkCycle(stream, tid);

    rec.onresult = (event) => {
      // Web Speech is captions-only now: fast, low-latency, shown while
      // listening, but never saved. The Whisper chunk pipeline (started
      // above) is the sole source of the authoritative transcript, so
      // nothing here calls api.addSegment or touches `segments`.
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const text = result[0].transcript.trim();
          if (text) setLiveCaption(text);
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

    //   rec._shouldRestart = true;
    //   rec.start();
    // }, []);
    rec._shouldRestart = true;
    rec.start();
  }, [transcriptId, sessionTitle, initialTranscriptId, initialSessionId]);
  // ── Hydrate from a transcript handed off by the Meetings tab ────────────────
  useEffect(() => {
    if (!initialTranscriptId) return;

    setTranscriptId(initialTranscriptId);
    setSessionTitle(initialSessionTitle || null);

    api
      .getTranscript(initialTranscriptId)
      .then((res) => {
        const existing = res?.data?.segments || [];
        const remoteStatus = res?.data?.session?.status;
        if (Array.isArray(existing) && existing.length > 0) {
          setSegments(
            existing.map((s, i) => ({
              id: s.id || `hydrated-${i}`,
              speaker: s.speakerName || "Speaker 1",
              text: s.text,
              time: s.createdAt || new Date().toISOString(),
              second: s.startedAtSecond ?? 0,
            })),
          );
        }
        // Fall back to the session's own title if none was passed down
        if (!initialSessionTitle && res?.data?.session?.title) {
          setSessionTitle(res.data.session.title);
        }

        // Virtual/LiveKit meetings never use this device's mic — their
        // transcript is derived from the call recording (Whisper) and
        // linked in asynchronously by the backend. Never start live
        // capture for those; just show whatever's there.
        if (initialReadOnly) {
          setPhase(remoteStatus === "RECORDING" ? "idle" : "stopped");
          if (remoteStatus === "COMPLETED") {
            setActiveTab("summary");
          }
          return;
        }

        // In-person flow: begin live capture against the SAME transcriptId —
        // handleStart sees transcriptId is already set and skips creating a
        // new one.
        handleStart();
      })
      .catch(() => {
        if (!initialReadOnly) handleStart();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTranscriptId, initialReadOnly]);
  // ── Stop recording ──────────────────────────────────────────────────────────
  const handleStop = useCallback(async () => {
    if (recRef.current) {
      recRef.current._shouldRestart = false;
      recRef.current.stop();
      recRef.current = null;
    }
    setInterimText("");
    setLiveCaption("");

    // Flush the in-progress chunk so the last few seconds aren't lost.
    await stopChunkCycle();
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

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
  }, [transcriptId, stopChunkCycle]);

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

  const hasTranscript = segments.some(
    (s) => s.status !== "failed" && s.status !== "processing",
  );
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
            {/* <p
              style={{ fontSize: 11, color: textSecondary, margin: "1px 0 0" }}
            >
              {phase === "recording"
                ? "● Recording live…"
                : phase === "stopped"
                  ? "Session complete"
                  : "Transcribe and annotate sessions"}
            </p> */}
            <p
              style={{ fontSize: 11, color: textSecondary, margin: "1px 0 0" }}
            >
              {sessionTitle
                ? `${sessionTitle} — ${
                    phase === "recording"
                      ? "● Recording live…"
                      : phase === "stopped"
                        ? "Session complete"
                        : "Ready to transcribe"
                  }`
                : phase === "recording"
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 8px",
                borderRadius: 7,
                border: `1px solid ${border}`,
                background: inputBg,
              }}
            >
              <Languages size={12} color={textSecondary} />
              <select
                value={language.code}
                onChange={(e) =>
                  setLanguage(
                    LANGUAGES.find((l) => l.code === e.target.value) ||
                      LANGUAGES[0],
                  )
                }
                style={{
                  border: "none",
                  background: "transparent",
                  color: textPrimary,
                  fontSize: 11,
                  fontFamily: "'Poppins', sans-serif",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
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
              // onClick={() => {
              //   setPhase("idle");
              //   setSegments([]);
              //   setSummary("");
              //   setQaHistory([]);
              //   setTranscriptId(null);
              //   setActiveTab("transcript");
              // }}
              onClick={() => {
                setPhase("idle");
                setSegments([]);
                setSummary("");
                setQaHistory([]);
                setTranscriptId(null);
                setSessionTitle(null);
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
                        onDismissFailed={dismissFailedSegment}
                      />
                    ))}
                    {phase === "recording" && liveCaption && (
                      <div
                        style={{
                          padding: "6px 10px",
                          borderRadius: 7,
                          color: textSecondary,
                          fontSize: 11,
                          fontStyle: "italic",
                          opacity: 0.7,
                        }}
                      >
                        Live caption (not saved): {liveCaption}
                      </div>
                    )}
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

function SegmentRow({
  seg,
  isDark,
  textPrimary,
  textSecondary,
  border,
  onDismissFailed,
}) {
  const isFailed = seg.status === "failed";
  const isProcessing = seg.status === "processing";
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 8,
        background: isFailed
          ? "rgba(239,68,68,0.06)"
          : isDark
            ? "rgba(255,255,255,0.03)"
            : "#f8fafc",
        border: `1px solid ${isFailed ? "rgba(239,68,68,0.3)" : border}`,
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
        {isProcessing ? (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: textSecondary,
              lineHeight: 1.6,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Loader2
              size={11}
              style={{ animation: "spin 1s linear infinite" }}
            />
            Transcribing chunk…
          </p>
        ) : isFailed ? (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#ef4444",
              lineHeight: 1.6,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Couldn't transcribe this chunk after 2 attempts.
            {onDismissFailed && (
              <button
                onClick={() => onDismissFailed(seg.id)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#ef4444",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <RotateCcw size={10} /> Dismiss
              </button>
            )}
          </p>
        ) : (
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
        )}
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
