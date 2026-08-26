import { useState } from "react";
import { statusConfig, FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function AttendeeRow({ attendee: a, t }) {
  const [hov, setHov] = useState(false);
  const cfg = statusConfig[a.status] || statusConfig.present;
  const Icon = cfg.icon;
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
      <div style={{ display: "flex", alignItems: "center", gap: 9, flex: "2 1 160px", minWidth: 0 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: FONT_WEIGHT.bold,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {(a.name || "?")[0]}
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: FONT_WEIGHT.semibold,
            color: t.text,
            fontFamily: FONT_FAMILY,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {a.name}
        </span>
      </div>
      <div style={{ flex: "1 1 90px", fontSize: 12, color: t.textSub, fontFamily: FONT_FAMILY }}>
        {a.joinTime}
      </div>
      <div style={{ flex: "1 1 90px", fontSize: 12, color: t.textSub, fontFamily: FONT_FAMILY }}>
        {a.leaveTime}
      </div>
      <div style={{ flex: "0 0 80px", fontSize: 12, color: t.textSub, fontFamily: FONT_FAMILY }}>
        {a.duration}
      </div>
      <div style={{ flex: "0 0 90px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              flex: 1,
              maxWidth: 60,
              height: 4,
              borderRadius: 99,
              background: t.barBg,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 99,
                background:
                  a.watchPercent >= 80
                    ? "#34d399"
                    : a.watchPercent >= 50
                      ? "#f59e0b"
                      : "#f87171",
                width: `${a.watchPercent}%`,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              color: t.text,
              fontFamily: FONT_FAMILY,
            }}
          >
            {a.watchPercent}%
          </span>
        </div>
      </div>
      <div style={{ flex: "0 0 60px", fontSize: 12, color: t.textSub, fontFamily: FONT_FAMILY }}>
        {a.chatMessages}
      </div>
      <div style={{ flex: "0 0 100px" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 9,
            fontWeight: FONT_WEIGHT.bold,
            letterSpacing: "0.08em",
            color: cfg.color,
            background: `${cfg.color}18`,
            border: `1px solid ${cfg.color}30`,
            padding: "3px 10px",
            borderRadius: 999,
            width: "fit-content",
            fontFamily: FONT_FAMILY,
          }}
        >
          <Icon size={10} color={cfg.color} /> {cfg.label}
        </span>
      </div>
    </div>
  );
}
