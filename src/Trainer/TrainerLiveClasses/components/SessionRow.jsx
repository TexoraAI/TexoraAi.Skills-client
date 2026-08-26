import { useState } from "react";
import { Video, Calendar, Clock, Radio, Lock } from "lucide-react";
import { parseScheduledDateTime, canShowGoLive, getGoLiveCountdown } from "../data/utils";
import CopyLinkBtn from "../components/CopyLinkBtn";
import ActionBtn from "../components/ActionBtn";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function SessionRow({
  session,
  t,
  navigate,
  handleEnd,
  handleDelete,
  handleStartLive,
}) {
  const [hov, setHov] = useState(false);
  const statusColors = {
    LIVE: "#f43f5e",
    SCHEDULED: "#22d3ee",
    ENDED: "#34d399",
  };
  const color = statusColors[session.status] || t.textMuted;
  const showGoLive = canShowGoLive(session);
  const countdown = !showGoLive ? getGoLiveCountdown(session) : null;
  const scheduledAt = parseScheduledDateTime(session);
  const displayDate = scheduledAt
    ? scheduledAt.toLocaleDateString()
    : (session.scheduledDate ?? "—");
  const displayTime = scheduledAt
    ? scheduledAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : (session.scheduledTime ?? "—");
  const actualEnd = session.actualEndTime
    ? new Date(session.actualEndTime)
    : null;
  const actualStart = session.actualStartTime
    ? new Date(session.actualStartTime)
    : null;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 14,
        background: hov ? t.recentItemBgHov : t.recentItemBg,
        border: `1px solid ${hov ? t.recentItemBorder : "transparent"}`,
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}18`,
          border: `1px solid ${color}30`,
          flexShrink: 0,
        }}
      >
        <Video size={15} color={color} />
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          cursor: session.status === "LIVE" ? "pointer" : "default",
        }}
        onClick={() => {
          if (session.status === "LIVE")
            navigate(`/trainer/live-controls/${session.id}`);
        }}
      >
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
          {session.title}
        </p>
        <div
          style={{ display: "flex", gap: 10, marginTop: 3, flexWrap: "wrap" }}
        >
          <span
            style={{
              fontSize: 10,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Calendar size={10} /> {displayDate}
          </span>
          <span
            style={{
              fontSize: 10,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Clock size={10} /> {displayTime}
          </span>
          {session.duration && (
            <span
              style={{
                fontSize: 10,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Radio size={10} /> {session.duration} min
            </span>
          )}
          {session.status === "LIVE" && actualStart && (
            <span
              style={{
                fontSize: 10,
                color: "#22c55e",
                fontFamily: FONT_FAMILY,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              ▶ Started{" "}
              {actualStart.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {session.status === "ENDED" && actualEnd && (
            <span
              style={{
                fontSize: 10,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              ■ Ended{" "}
              {actualEnd.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>
      <span
        style={{
          fontSize: 9,
          fontWeight: FONT_WEIGHT.bold,
          letterSpacing: "0.1em",
          color,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          padding: "3px 10px",
          borderRadius: 999,
          fontFamily: FONT_FAMILY,
          display: "flex",
          alignItems: "center",
          gap: 5,
          flexShrink: 0,
        }}
      >
        {session.status === "LIVE" && (
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: color,
              display: "inline-block",
              animation: "liveDot 1.2s ease-in-out infinite",
            }}
          />
        )}
        {session.status}
      </span>
      <div
        style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}
      >
        {(session.status === "SCHEDULED" || session.status === "LIVE") && (
          <CopyLinkBtn sessionId={session.id} />
        )}
        {session.status === "SCHEDULED" && showGoLive && (
          <ActionBtn
            label="Go Live"
            color="#22c55e"
            onClick={() => handleStartLive(session.id)}
          />
        )}
        {session.status === "SCHEDULED" && !showGoLive && countdown && (
          <span
            style={{
              fontSize: 9,
              fontWeight: FONT_WEIGHT.semibold,
              color: "#22d3ee",
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.2)",
              padding: "4px 10px",
              borderRadius: 8,
              fontFamily: FONT_FAMILY,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Clock size={9} />
            {countdown}
          </span>
        )}
        {session.status === "SCHEDULED" && !showGoLive && !countdown && (
          <span
            style={{
              fontSize: 9,
              fontWeight: FONT_WEIGHT.semibold,
              color: t.textMuted,
              background: t.barBg,
              border: `1px solid ${t.border}`,
              padding: "4px 10px",
              borderRadius: 8,
              fontFamily: FONT_FAMILY,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Lock size={9} /> Locked
          </span>
        )}
        {session.status === "LIVE" && (
          <>
            {/* <ActionBtn
              label="Join"
              color="#34d399"
              onClick={() => navigate(`/trainer/live-controls/${session.id}`)}
            /> */}
            <ActionBtn
              label="Join"
              color="#34d399"
              onClick={() => {
                if (
                  session.meetingType === "EXTERNAL" &&
                  session.externalMeetingUrl
                ) {
                  window.open(session.externalMeetingUrl, "_blank");
                } else {
                  navigate(`/trainer/live-controls/${session.id}`);
                }
              }}
            />
            <ActionBtn
              label="End"
              color="#f59e0b"
              onClick={() => handleEnd(session.id)}
            />
          </>
        )}
        {session.status === "ENDED" && (
          <ActionBtn
            label="Delete"
            color="#f43f5e"
            onClick={() => handleDelete(session.id)}
          />
        )}
      </div>
    </div>
  );
}
