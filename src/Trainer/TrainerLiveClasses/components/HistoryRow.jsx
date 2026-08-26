import { useState } from "react";
import { Video, Clock, Play } from "lucide-react";
import { parseScheduledDateTime } from "../data/utils";
import HeroBtn from "../components/HeroBtn";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function HistoryRow({ session: s, t, navigate, recording, onViewRecording }) {
  const [hov, setHov] = useState(false);
  const statusColors = {
    LIVE: "#f43f5e",
    SCHEDULED: "#22d3ee",
    ENDED: "#34d399",
  };
  const statusColor = statusColors[s.status] || "#94a3b8";
  const scheduledAt = parseScheduledDateTime(s);
  const displayDate = scheduledAt
    ? scheduledAt.toLocaleDateString()
    : (s.scheduledDate ?? "—");
  const displayTime = scheduledAt
    ? scheduledAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : (s.scheduledTime ?? "—");

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="rlc-list-row"
      style={{
        borderRadius: 14,
        border: `1px solid ${hov ? t.recentItemBorder : "transparent"}`,
        background: hov ? t.recentItemBgHov : t.recentItemBg,
        padding: "12px 14px",
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "2 1 200px", minWidth: 0 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(34,211,238,0.1)",
            border: "1px solid rgba(34,211,238,0.2)",
            flexShrink: 0,
          }}
        >
          <Video size={14} color="#22d3ee" />
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: FONT_WEIGHT.semibold,
              color: t.text,
              margin: 0,
              fontFamily: FONT_FAMILY,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {s.title}
          </p>
          <p
            style={{
              fontSize: 10,
              color: t.textMuted,
              margin: "2px 0 0",
              fontFamily: FONT_FAMILY,
            }}
          >
            {s.batchName ?? ""}
          </p>
        </div>
      </div>
      <div style={{ flex: "1 1 140px" }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: FONT_WEIGHT.semibold,
            color: t.text,
            margin: 0,
            fontFamily: FONT_FAMILY,
          }}
        >
          {displayDate}
        </p>
        <p
          style={{
            fontSize: 10,
            color: t.textMuted,
            margin: "2px 0 0",
            fontFamily: FONT_FAMILY,
          }}
        >
          {displayTime}
        </p>
      </div>
      <div style={{ flex: "0 0 100px" }}>
        <span
          style={{
            fontSize: 12,
            color: t.textSub,
            fontFamily: FONT_FAMILY,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Clock size={12} /> {s.duration ? `${s.duration} min` : "—"}
        </span>
      </div>
      <div style={{ flex: "0 0 110px" }}>
        <span
          style={{
            fontSize: 9,
            fontWeight: FONT_WEIGHT.bold,
            letterSpacing: "0.08em",
            color: statusColor,
            background: `${statusColor}18`,
            border: `1px solid ${statusColor}30`,
            padding: "3px 10px",
            borderRadius: 999,
            fontFamily: FONT_FAMILY,
            display: "flex",
            alignItems: "center",
            gap: 4,
            width: "fit-content",
          }}
        >
          {s.status === "LIVE" && (
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: statusColor,
                display: "inline-block",
                animation: "liveDot 1.2s ease-in-out infinite",
              }}
            />
          )}
          {s.status}
        </span>
      </div>
      <div style={{ flex: "0 0 auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {recording && (
          <HeroBtn
            label="Recording"
            icon={Play}
            color="#a78bfa"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewRecording) onViewRecording(recording.id);
            }}
          />
        )}
        {!recording && s.recordingUrl && (
          <HeroBtn
            label="Replay"
            icon={Play}
            color="#a78bfa"
            onClick={() => window.open(s.recordingUrl, "_blank")}
          />
        )}
      </div>
    </div>
  );
}
