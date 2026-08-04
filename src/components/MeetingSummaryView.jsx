import { useState, useEffect, useCallback, useRef } from "react";
import { getMeetingSummary } from "../services/chatService"; // ⚠️ adjust to actual path

const POLL_MS = 4000;

export function MeetingSummaryView({ meetingId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const fetchOnce = useCallback(async () => {
    try {
      const res = await getMeetingSummary(meetingId);
      setData(res.data);
      setError(null);
      if (res.data?.status === "PENDING" || res.data?.status === "GENERATING") {
        timerRef.current = setTimeout(fetchOnce, POLL_MS);
      }
    } catch (err) {
      setError(
        err?.response?.status === 403 || err?.response?.status === 404
          ? "You don't have access to this summary."
          : "Failed to load summary.",
      );
    }
  }, [meetingId]);

  useEffect(() => {
    fetchOnce();
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [fetchOnce]);

  if (error)
    return <div style={{ padding: 16, color: "#ef4444" }}>{error}</div>;
  if (!data) return <div style={{ padding: 16 }}>Loading…</div>;

  if (data.status === "PENDING" || data.status === "GENERATING") {
    return <div style={{ padding: 16 }}>Generating summary…</div>;
  }
  if (data.status === "FAILED") {
    return (
      <div style={{ padding: 16 }}>
        Summary generation failed.
        <button onClick={fetchOnce} style={{ marginLeft: 8 }}>
          Retry
        </button>
      </div>
    );
  }
  return (
    <div style={{ padding: 16, whiteSpace: "pre-wrap" }}>
      <h4 style={{ margin: "0 0 8px" }}>{data.title}</h4>
      <p>{data.summaryText}</p>
    </div>
  );
}
