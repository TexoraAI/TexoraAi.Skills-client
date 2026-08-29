import { useEffect, useRef, useState } from "react";
import roadmapService from "../../services/roadmapService";

/**
 * Slide-in AI mentor chat, backed by:
 *   GET  /api/roadmap-upgraded/mentor/{syllabusId}/history
 *   POST /api/roadmap-upgraded/mentor/ask   { syllabusId, message }
 *
 * Props:
 *   open          - boolean
 *   onClose       - () => void
 *   syllabusId    - number, required once open
 *   roadmapTitle  - string, shown in the header
 *   contextLabel  - short string, e.g. "Module 3 · React & Component Architecture"
 */
export default function MentorPanel({ open, onClose, syllabusId, roadmapTitle, contextLabel }) {
  const [messages, setMessages] = useState([]); // [{ id, sender: 'USER'|'MENTOR', messageText, sentAt }]
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open || !syllabusId) return;
    let cancelled = false;
    setLoadingHistory(true);
    setError("");
    roadmapService
      .getMentorHistory(syllabusId)
      .then((history) => {
        if (cancelled) return;
        setMessages(history || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Couldn't load mentor history.");
      })
      .finally(() => !cancelled && setLoadingHistory(false));
    return () => {
      cancelled = true;
    };
  }, [open, syllabusId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  async function send(text) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || sending || !syllabusId) return;
    setInput("");
    setSuggestions([]);
    setError("");
    // optimistic user bubble
    setMessages((prev) => [...prev, { id: `tmp-${Date.now()}`, sender: "USER", messageText: trimmed }]);
    setSending(true);
    try {
      const res = await roadmapService.askMentor(syllabusId, trimmed);
      setMessages((prev) => [...prev, { id: `tmp-r-${Date.now()}`, sender: "MENTOR", messageText: res.reply }]);
      setSuggestions(res.suggestedFollowUps || []);
    } catch (err) {
      setError(err.message || "The mentor couldn't respond just now.");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="ru-mentor-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ru-mentor-panel" onClick={(e) => e.stopPropagation()}>
        <div className="ru-mentor-head">
          <div>
            <div className="ru-eyebrow" style={{ marginBottom: 2 }}>AI MENTOR</div>
            <h3 style={{ fontSize: "1.1rem" }}>{roadmapTitle || "This roadmap"}</h3>
          </div>
          <button className="ru-mentor-close" onClick={onClose}>✕</button>
        </div>

        {contextLabel && (
          <div className="ru-mentor-context">{contextLabel}</div>
        )}

        <div className="ru-mentor-messages" ref={scrollRef}>
          {loadingHistory && <div className="ru-loading">Loading conversation…</div>}
          {!loadingHistory && messages.length === 0 && (
            <div className={`ru-mmsg bot`}>
              Ask me anything about this roadmap — a module, a resource, or what to do next.
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`ru-mmsg ${m.sender === "USER" ? "user" : "bot"}`}>
              {m.messageText}
            </div>
          ))}
          {sending && (
            <div className="ru-mmsg bot typing"><span /><span /><span /></div>
          )}
        </div>

        {error && <div className="ru-error" style={{ margin: "0 22px 12px" }}>{error}</div>}

        {suggestions.length > 0 && (
          <div className="ru-mentor-suggestions">
            {suggestions.map((s, i) => (
              <div key={i} className="ru-msug" onClick={() => send(s)}>{s}</div>
            ))}
          </div>
        )}

        <div className="ru-mentor-input-row">
          <input
            className="ru-mentor-input"
            placeholder="Ask about this module, a resource, or what to do next…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={sending}
          />
          <button className="ru-mentor-send" onClick={() => send()} disabled={sending || !input.trim()}>→</button>
        </div>
      </div>
    </div>
  );
}
