// Reused verbatim from Dashboard/components/PageHead.jsx — same markup,
// same classes (.ws-page-head, .live-pill, .date-pill), so every demo page
// looks exactly like the equivalent real Dashboard page.
export default function DemoPageHead({ eyebrow, title, subtitle, actions, showLive = true }) {
  const dateLabel = "Sat, Aug 23, 2026";

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
