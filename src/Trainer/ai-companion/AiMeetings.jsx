// src/Trainer/ai-companion/AiMeetings.jsx
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Video,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Mic,
  ExternalLink,
  Clock,
  Users,
  AlertCircle,
  Loader2,
  RefreshCw,
  LayoutList,
  Send,
  AtSign,
  Layers,
} from "lucide-react";
import {
  getTrainerCalendar,
  startAiTranscript,
  sendAiCompanionMessage,
} from "../../services/liveSessionService";

// ─── Helpers (unchanged from working version) ─────────────────────────────────

function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function normaliseDate(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    const [y, m, d] = raw;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  if (typeof raw === "string") return raw.split("T")[0];
  return null;
}

function getSessionDate(s) {
  const raw =
    s?.scheduledDate ??
    s?.date ??
    s?.sessionDate ??
    s?.startDate ??
    s?.startTime ??
    s?.time ??
    null;
  return normaliseDate(raw);
}

function getSessionTitle(s) {
  return s?.title || s?.sessionTitle || s?.name || "Untitled Session";
}

function getSessionTime(s) {
  const raw =
    s?.scheduledTime ?? s?.startTime ?? s?.time ?? s?.sessionTime ?? null;
  if (!raw || Array.isArray(raw)) return null;
  try {
    if (raw.includes("T")) {
      const d = new Date(raw);
      if (!isNaN(d))
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (/^\d{2}:\d{2}/.test(raw)) return raw.slice(0, 5);
  } catch {
    /* ignore */
  }
  return null;
}

function getJoinUrl(s) {
  return (
    s?.externalMeetingUrl ||
    s?.meetingLink ||
    s?.joinUrl ||
    s?.meetingUrl ||
    null
  );
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AiMeetings({ isDark, onNavigate, onTranscriptStart }) {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [allSessions, setAllSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [transcribing, setTranscribing] = useState(null);
  const [bottomMsg, setBottomMsg] = useState("");
  const [compactView, setCompactView] = useState(false);

  // ── AI Chat states ──────────────────────────────────────────────────────────
  const [meetingChatMessages, setMeetingChatMessages] = useState([]);
  const [meetingChatLoading, setMeetingChatLoading] = useState(false);
  const [meetingChatError, setMeetingChatError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const chatMessagesEndRef = useRef(null);

  // ── Theme tokens ────────────────────────────────────────────────────────────
  const bg = isDark ? "#0d1117" : "#f8fafc";
  const card = isDark ? "#111827" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const softBorder = isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9";
  const text = isDark ? "#f9fafb" : "#0f172a";
  const textSub = isDark ? "rgba(255,255,255,0.45)" : "#64748b";
  const textMuted = isDark ? "rgba(255,255,255,0.22)" : "#94a3b8";
  const accent = "#2563eb";
  const accentBg = isDark ? "rgba(37,99,235,0.12)" : "#eff6ff";
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9";
  const todayBg = isDark ? "rgba(37,99,235,0.25)" : "#dbeafe";
  const inputBg = isDark ? "#1a2333" : "#f8fafc";
  const userMsgBg = isDark ? "rgba(37,99,235,0.15)" : "#dbeafe";
  const aiMsgBg = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9";

  // ── Auto-scroll chat to bottom ──────────────────────────────────────────────
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [meetingChatMessages]);

  // ── Fetch (unchanged logic) ─────────────────────────────────────────────────
  const fetchSessions = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const from = toYMD(new Date(year, month, 1));
        const to = toYMD(new Date(year, month + 1, 0));
        const res = await getTrainerCalendar(from, to);
        const data = res?.data;
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.sessions)
            ? data.sessions
            : Array.isArray(data?.content)
              ? data.content
              : Array.isArray(data?.data)
                ? data.data
                : [];
        setAllSessions(items);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setError("Failed to load sessions. Please try again.");
        setAllSessions([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [calendarMonth],
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const selectedYMD = toYMD(selectedDate);

  // Memoize sessionsForDate to prevent infinite loop
  const sessionsForDate = useMemo(() => {
    return allSessions.filter((s) => {
      const d = getSessionDate(s);
      return d && d.startsWith(selectedYMD);
    });
  }, [allSessions, selectedYMD]);
  const sessionDates = new Set(
    allSessions
      .map((s) => {
        const d = getSessionDate(s);
        return d ? d.split("T")[0] : null;
      })
      .filter(Boolean),
  );

  // ── Auto-select first session when date changes ──────────────────────────────
  useEffect(() => {
    if (sessionsForDate.length === 1) {
      const onlySession = sessionsForDate[0];
      setSelectedSession((prev) => {
        // Only update if it's actually different
        if (prev?.id === onlySession?.id) return prev;
        return onlySession;
      });
    } else if (sessionsForDate.length === 0) {
      setSelectedSession((prev) => {
        // Only update if it's actually different
        if (prev === null) return prev;
        return null;
      });
    }

    // Clear chat when date changes (but not on every render)
    setMeetingChatMessages((prev) => {
      if (prev.length === 0) return prev;
      return [];
    });
    setMeetingChatError((prev) => {
      if (prev === null) return prev;
      return null;
    });
  }, [sessionsForDate]);

  // ── Navigation ───────────────────────────────────────────────────────────────
  const goToday = () => {
    const t = new Date();
    setSelectedDate(t);
    setCalendarMonth(new Date(t.getFullYear(), t.getMonth(), 1));
  };
  const prevMonth = () =>
    setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () =>
    setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  const monthTitle = calendarMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // ── Transcript ───────────────────────────────────────────────────────────────
  const handleStartTranscribing = async (session = null) => {
    const key = session ? session.id || "session" : "general";
    setTranscribing(key);
    try {
      const payload = session
        ? { liveSessionId: session.id || null, title: getSessionTitle(session) }
        : { liveSessionId: null, title: "In-person transcript" };
      const res = await startAiTranscript(payload);
      const transcriptId =
        res?.data?.id ||
        res?.data?.transcriptId ||
        res?.data?.sessionId ||
        null;
      if (onTranscriptStart) {
        onTranscriptStart({
          transcriptId,
          liveSessionId: session?.id || null,
          sessionTitle: session
            ? getSessionTitle(session)
            : "In-person transcript",
        });
      } else if (onNavigate) {
        onNavigate("notes");
      }
    } catch (err) {
      console.error("Failed to start transcript:", err);
      alert("Failed to start transcription. Please try again.");
    } finally {
      setTranscribing(null);
    }
  };

  // ── AI Chat handler ─────────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    const trimmedMsg = bottomMsg.trim();
    if (!trimmedMsg || meetingChatLoading) return;

    // Add user message immediately
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmedMsg,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMeetingChatMessages((prev) => [...prev, userMessage]);
    setBottomMsg("");
    setMeetingChatLoading(true);
    setMeetingChatError(null);

    try {
      // Build additional context
      const sessionTitles = sessionsForDate.map(getSessionTitle).join(", ");
      const additionalContext = `AI Companion Meetings page. Selected date: ${selectedYMD}. Sessions on this date: ${sessionTitles || "none"}`;

      // Call existing AI Companion chat endpoint
      const response = await sendAiCompanionMessage(
        selectedSession?.id || null,
        "CUSTOM_QUESTION",
        trimmedMsg,
        additionalContext,
        ["MEETINGS"],
        [],
        null,
        true,
      );

      // Parse response - handle multiple possible shapes
      let aiResponse = null;
      if (response?.response) aiResponse = response.response;
      else if (response?.data?.response) aiResponse = response.data.response;
      else if (response?.answer) aiResponse = response.answer;
      else if (response?.data?.answer) aiResponse = response.data.answer;
      else if (response?.message) aiResponse = response.message;
      else aiResponse = "AI response received, but no text was returned.";

      // Add AI response to chat
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMeetingChatMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Failed to send AI message:", err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to get AI response. Please try again.";
      setMeetingChatError(errorMsg);
    } finally {
      setMeetingChatLoading(false);
    }
  };

  // ── Shared icon-button style ──────────────────────────────────────────────────
  const iconBtn = (active = false) => ({
    width: 32,
    height: 32,
    borderRadius: 8,
    border: `1px solid ${active ? accent + "40" : border}`,
    background: active ? accentBg : "transparent",
    color: active ? accent : textSub,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.12s, border-color 0.12s",
    flexShrink: 0,
  });

  // ── Calendar grid ────────────────────────────────────────────────────────────
  const renderCalendar = () => {
    const year = calendarMonth.getFullYear(),
      month = calendarMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month),
      firstDay = getFirstDayOfMonth(year, month);
    const todayYMD = toYMD(today);
    const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} />);
    for (let d = 1; d <= daysInMonth; d++) {
      const ymd = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isTod = ymd === todayYMD,
        isSel = ymd === selectedYMD,
        hasSess = sessionDates.has(ymd);
      cells.push(
        <button
          key={d}
          onClick={() => setSelectedDate(new Date(year, month, d))}
          style={{
            position: "relative",
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            fontSize: 11,
            fontWeight: isSel || isTod ? 700 : 400,
            background: isSel ? accent : isTod ? todayBg : "transparent",
            color: isSel ? "#fff" : isTod ? accent : text,
            transition: "background 0.1s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            if (!isSel)
              e.currentTarget.style.background = isTod ? todayBg : hoverBg;
          }}
          onMouseLeave={(e) => {
            if (!isSel)
              e.currentTarget.style.background = isTod
                ? todayBg
                : "transparent";
          }}
        >
          {d}
          {hasSess && (
            <span
              style={{
                position: "absolute",
                bottom: 2,
                left: "50%",
                transform: "translateX(-50%)",
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: isSel ? "#bfdbfe" : accent,
              }}
            />
          )}
        </button>,
      );
    }
    return (
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 30px)",
            gap: 2,
            marginBottom: 4,
          }}
        >
          {DAY_LABELS.map((d) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                fontSize: 9,
                color: textMuted,
                fontWeight: 700,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 30px)",
            gap: 2,
          }}
        >
          {cells}
        </div>
      </div>
    );
  };

  // ── Session card ─────────────────────────────────────────────────────────────
  const renderSessionCard = (session, idx) => {
    const title = getSessionTitle(session);
    const status = session?.status || "Scheduled";
    const time = getSessionTime(session);
    const duration = session?.duration || session?.durationMinutes || null;
    const batch = session?.batchName || null;
    const mode = session?.meetingType || session?.sessionMode || null;
    const joinUrl = getJoinUrl(session);
    const key = session?.id || idx;
    const isTx = transcribing === (session?.id || "session");
    const isSelected = selectedSession?.id === session?.id;

    const statusColor =
      status?.toLowerCase() === "live" || status?.toLowerCase() === "ongoing"
        ? "#22c55e"
        : status?.toLowerCase() === "completed" ||
            status?.toLowerCase() === "ended"
          ? "#64748b"
          : accent;

    return (
      <div
        key={key}
        onClick={() => setSelectedSession(session)}
        style={{
          background: isSelected ? accentBg : card,
          border: `1px solid ${isSelected ? accent + "40" : border}`,
          borderRadius: 12,
          padding: compactView ? "10px 14px" : "14px 16px",
          marginBottom: 8,
          cursor: "pointer",
          transition: "box-shadow 0.15s, border-color 0.15s, background 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = isDark
            ? "0 4px 20px rgba(0,0,0,0.35)"
            : "0 2px 12px rgba(37,99,235,0.08)";
          if (!isSelected)
            e.currentTarget.style.borderColor = isDark
              ? "rgba(255,255,255,0.14)"
              : "#cbd5e1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
          if (!isSelected) e.currentTarget.style.borderColor = border;
        }}
      >
        {/* Title + badges */}
        <div style={{ marginBottom: compactView ? 6 : 8 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: text,
              fontFamily: "'Poppins', sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginBottom: 5,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: statusColor,
                background: `${statusColor}15`,
                border: `1px solid ${statusColor}28`,
                padding: "2px 8px",
                borderRadius: 20,
                fontFamily: "'Poppins', sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {status}
            </span>
            {mode && (
              <span
                style={{
                  fontSize: 9,
                  color: textSub,
                  background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
                  border: `1px solid ${border}`,
                  padding: "2px 8px",
                  borderRadius: 20,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {mode}
              </span>
            )}
          </div>
        </div>

        {/* Meta — hidden in compact view */}
        {!compactView && (time || duration || batch) && (
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {time && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: textSub,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <Clock size={10} color={textMuted} />
                {time}
              </span>
            )}
            {duration && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: textSub,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <CalendarDays size={10} color={textMuted} />
                {duration} min
              </span>
            )}
            {batch && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: textSub,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <Users size={10} color={textMuted} />
                {batch}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStartTranscribing(session);
            }}
            disabled={!!isTx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 7,
              border: "none",
              background: accentBg,
              color: accent,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              cursor: isTx ? "not-allowed" : "pointer",
              opacity: isTx ? 0.65 : 1,
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => {
              if (!isTx)
                e.currentTarget.style.background = isDark
                  ? "rgba(37,99,235,0.22)"
                  : "#dbeafe";
            }}
            onMouseLeave={(e) => {
              if (!isTx) e.currentTarget.style.background = accentBg;
            }}
          >
            {isTx ? (
              <Loader2
                size={11}
                style={{ animation: "ai-spin 1s linear infinite" }}
              />
            ) : (
              <Mic size={11} />
            )}
            {isTx ? "Starting…" : "Start Transcribing"}
          </button>

          {joinUrl ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(joinUrl, "_blank");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 7,
                border: `1px solid ${border}`,
                background: "transparent",
                color: text,
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <ExternalLink size={11} /> Open Session
            </button>
          ) : (
            <button
              disabled
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 7,
                border: `1px solid ${border}`,
                background: "transparent",
                color: textMuted,
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
                cursor: "not-allowed",
                opacity: 0.45,
              }}
            >
              <ExternalLink size={11} /> No Link
            </button>
          )}
        </div>
      </div>
    );
  };

  // ── Empty state ──────────────────────────────────────────────────────────────
  const renderEmptyState = () => (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        textAlign: "center",
        minHeight: 300,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 18,
          background: accentBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          boxShadow: `0 8px 24px ${accent}18`,
        }}
      >
        <Video size={26} color={accent} />
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: text,
          marginBottom: 10,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        No meetings available
      </div>
      <div
        style={{
          fontSize: 13,
          color: textSub,
          marginBottom: 24,
          maxWidth: 310,
          lineHeight: 1.7,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Transcribe in-person conversations to ask questions, generate summaries,
        and more.
      </div>
      <button
        onClick={() => handleStartTranscribing(null)}
        disabled={transcribing === "general"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "9px 20px",
          borderRadius: 10,
          border: "none",
          background: accent,
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "'Poppins', sans-serif",
          cursor: transcribing === "general" ? "not-allowed" : "pointer",
          opacity: transcribing === "general" ? 0.7 : 1,
          transition: "background 0.15s",
          boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
        }}
        onMouseEnter={(e) => {
          if (transcribing !== "general")
            e.currentTarget.style.background = "#1d4ed8";
        }}
        onMouseLeave={(e) => {
          if (transcribing !== "general")
            e.currentTarget.style.background = accent;
        }}
      >
        {transcribing === "general" ? (
          <Loader2
            size={13}
            style={{ animation: "ai-spin 1s linear infinite" }}
          />
        ) : (
          <Mic size={13} />
        )}
        {transcribing === "general"
          ? "Starting…"
          : "Start in-person transcription"}
      </button>
    </div>
  );

  const selectedDateLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: bg,
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ══ TOP TOOLBAR ════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 16px",
          height: 52,
          borderBottom: `1px solid ${border}`,
          background: card,
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginRight: 6,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: accentBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Video size={14} color={accent} />
          </div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: text,
              letterSpacing: "-0.01em",
            }}
          >
            Meetings
          </span>
        </div>

        {/* Divider */}
        <div
          style={{ width: 1, height: 20, background: border, marginRight: 2 }}
        />

        {/* Today + chevron (split button) */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={goToday}
            style={{
              padding: "0 12px",
              height: 30,
              borderRadius: "8px 0 0 8px",
              border: `1px solid ${border}`,
              borderRight: "none",
              background: "transparent",
              color: text,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Today
          </button>
          <div
            style={{
              height: 30,
              padding: "0 6px",
              borderRadius: "0 8px 8px 0",
              border: `1px solid ${border}`,
              display: "flex",
              alignItems: "center",
              color: textMuted,
            }}
          >
            <ChevronDown size={11} />
          </div>
        </div>

        {/* Prev / Next */}
        <button
          onClick={prevMonth}
          style={iconBtn()}
          onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={nextMonth}
          style={iconBtn()}
          onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <ChevronRight size={14} />
        </button>

        {/* Month title */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: text,
            minWidth: 110,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {monthTitle}
        </span>

        <div style={{ flex: 1 }} />

        {/* Refresh */}
        <button
          onClick={() => fetchSessions(true)}
          title="Refresh"
          style={iconBtn()}
          onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <RefreshCw
            size={13}
            color={refreshing ? accent : textSub}
            style={{
              animation: refreshing ? "ai-spin 0.7s linear infinite" : "none",
            }}
          />
        </button>

        {/* List / compact toggle */}
        <button
          onClick={() => setCompactView((v) => !v)}
          title={compactView ? "Detailed view" : "Compact view"}
          style={iconBtn(compactView)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = compactView
              ? accentBg
              : hoverBg)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = compactView
              ? accentBg
              : "transparent")
          }
        >
          <LayoutList size={13} />
        </button>

        {/* Start transcribing */}
        <button
          onClick={() => handleStartTranscribing(null)}
          disabled={transcribing === "general"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 14px",
            height: 30,
            borderRadius: 8,
            border: "none",
            background: accent,
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            cursor: transcribing === "general" ? "not-allowed" : "pointer",
            opacity: transcribing === "general" ? 0.7 : 1,
            transition: "background 0.15s",
            boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (transcribing !== "general")
              e.currentTarget.style.background = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            if (transcribing !== "general")
              e.currentTarget.style.background = accent;
          }}
        >
          {transcribing === "general" ? (
            <Loader2
              size={12}
              style={{ animation: "ai-spin 1s linear infinite" }}
            />
          ) : (
            <Mic size={12} />
          )}
          Start transcribing
        </button>
      </div>

      {/* ══ BODY ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}
      >
        {/* Left calendar sidebar */}
        <div
          style={{
            width: 262,
            minWidth: 262,
            flexShrink: 0,
            borderRight: `1px solid ${border}`,
            background: card,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "14px 14px 10px",
              borderBottom: `1px solid ${softBorder}`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "'Poppins', sans-serif",
                marginBottom: 10,
              }}
            >
              Calendar
            </div>
            {renderCalendar()}
          </div>

          {/* Legend */}
          <div style={{ padding: "12px 14px" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Legend
            </div>
            {[
              {
                swatch: (
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: todayBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      color: accent,
                    }}
                  >
                    {today.getDate()}
                  </div>
                ),
                label: "Today",
              },
              {
                swatch: (
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    ✓
                  </div>
                ),
                label: "Selected",
              },
              {
                swatch: (
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 9, color: text }}>8</span>
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: accent,
                      }}
                    />
                  </div>
                ),
                label: "Has session",
              },
            ].map(({ swatch, label }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 5,
                  fontSize: 11,
                  color: textSub,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {swatch}
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: sessions + bottom bar */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {/* Date heading */}
          <div
            style={{
              padding: "10px 18px 9px",
              borderBottom: `1px solid ${border}`,
              background: card,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: text,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {selectedDateLabel}
              </div>
              {!loading && (
                <div
                  style={{
                    fontSize: 11,
                    color: textMuted,
                    marginTop: 1,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {sessionsForDate.length > 0
                    ? `${sessionsForDate.length} session${sessionsForDate.length > 1 ? "s" : ""} scheduled`
                    : "No sessions scheduled"}
                </div>
              )}
            </div>
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: textMuted,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <Loader2
                  size={12}
                  style={{ animation: "ai-spin 1s linear infinite" }}
                  color={accent}
                />
                Loading…
              </div>
            )}
          </div>

          {/* Session list (scrollable) */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px 8px" }}>
            {!loading && error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "11px 14px",
                  borderRadius: 10,
                  marginBottom: 12,
                  background: isDark ? "rgba(239,68,68,0.1)" : "#fef2f2",
                  border: `1px solid ${isDark ? "rgba(239,68,68,0.2)" : "#fecaca"}`,
                  color: "#ef4444",
                  fontSize: 12,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <AlertCircle size={13} />
                {error}
                <button
                  onClick={() => fetchSessions()}
                  style={{
                    marginLeft: "auto",
                    padding: "3px 9px",
                    borderRadius: 6,
                    border: "1px solid #ef4444",
                    background: "transparent",
                    color: "#ef4444",
                    fontSize: 11,
                    fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {!loading &&
              !error &&
              (sessionsForDate.length > 0
                ? sessionsForDate.map((s, i) => renderSessionCard(s, i))
                : renderEmptyState())}
          </div>

          {/* ══ CHAT MESSAGES AREA ════════════════════════════════════════════ */}
          {meetingChatMessages.length > 0 && (
            <div
              style={{
                flexShrink: 0,
                maxHeight: 200,
                overflowY: "auto",
                borderTop: `1px solid ${border}`,
                background: bg,
                padding: "10px 16px",
              }}
            >
              {meetingChatMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: msg.role === "user" ? userMsgBg : aiMsgBg,
                      border:
                        msg.role === "user"
                          ? `1px solid ${accent}28`
                          : `1px solid ${border}`,
                      color: text,
                      fontSize: 12,
                      fontFamily: "'Poppins', sans-serif",
                      lineHeight: 1.5,
                      wordWrap: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {meetingChatLoading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: aiMsgBg,
                      border: `1px solid ${border}`,
                      color: textSub,
                      fontSize: 12,
                      fontFamily: "'Poppins', sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Loader2
                      size={12}
                      style={{ animation: "ai-spin 1s linear infinite" }}
                    />
                    Thinking…
                  </div>
                </div>
              )}
              {meetingChatError && (
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    background: isDark ? "rgba(239,68,68,0.1)" : "#fef2f2",
                    border: `1px solid ${isDark ? "rgba(239,68,68,0.2)" : "#fecaca"}`,
                    color: "#ef4444",
                    fontSize: 11,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {meetingChatError}
                </div>
              )}
              <div ref={chatMessagesEndRef} />
            </div>
          )}

          {/* ══ BOTTOM AI INPUT BAR ═══════════════════════════════════════════ */}
          <div
            style={{
              flexShrink: 0,
              borderTop: `1px solid ${border}`,
              background: card,
              padding: "10px 16px 12px",
            }}
          >
            {/* Textarea row */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                background: inputBg,
                border: `1px solid ${border}`,
                borderRadius: 12,
                padding: "9px 12px",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocusCapture={(e) => {
                e.currentTarget.style.borderColor = accent;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}18`;
              }}
              onBlurCapture={(e) => {
                e.currentTarget.style.borderColor = border;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <textarea
                value={bottomMsg}
                onChange={(e) => setBottomMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Write a message or type @ for context"
                rows={1}
                disabled={meetingChatLoading}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: text,
                  fontSize: 12,
                  fontFamily: "'Poppins', sans-serif",
                  resize: "none",
                  lineHeight: 1.55,
                  minHeight: 20,
                  maxHeight: 72,
                  overflowY: "auto",
                  opacity: meetingChatLoading ? 0.6 : 1,
                  cursor: meetingChatLoading ? "not-allowed" : "text",
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!bottomMsg.trim() || meetingChatLoading}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  border: "none",
                  background:
                    bottomMsg.trim() && !meetingChatLoading
                      ? accent
                      : isDark
                        ? "rgba(255,255,255,0.08)"
                        : "#e2e8f0",
                  color:
                    bottomMsg.trim() && !meetingChatLoading
                      ? "#fff"
                      : textMuted,
                  cursor:
                    bottomMsg.trim() && !meetingChatLoading
                      ? "pointer"
                      : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.15s",
                  opacity: meetingChatLoading ? 0.6 : 1,
                }}
              >
                {meetingChatLoading ? (
                  <Loader2
                    size={12}
                    style={{ animation: "ai-spin 1s linear infinite" }}
                  />
                ) : (
                  <Send size={12} />
                )}
              </button>
            </div>

            {/* Footer controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 7,
              }}
            >
              {[
                { icon: <Layers size={10} />, label: "All sources" },
                { icon: <AtSign size={10} />, label: "Mode" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 9px",
                    borderRadius: 6,
                    border: `1px solid ${border}`,
                    background: "transparent",
                    color: textSub,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = hoverBg)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {icon}
                  {label}
                </button>
              ))}
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  color: textMuted,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Enter to send · Shift+Enter for new line
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ai-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
