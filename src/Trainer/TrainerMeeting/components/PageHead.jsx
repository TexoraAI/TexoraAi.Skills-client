import React from "react";

export default function PageHead({ eyebrow, title, subtitle, actions, showLive = true }) {
  const today = new Date("2026-08-23T09:00:00");
  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="ws-page-head">
      <div className="ws-page-head-title">
        {eyebrow && <p className="ws-page-head-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="ws-page-head-actions">
        {showLive && (
          <span className="live-pill">
            <span className="dot" /> Live
          </span>
        )}
        <span className="date-pill">{dateLabel}</span>
        {actions}
      </div>
    </div>
  );
}