import { useState } from "react";

export const Btn = ({
  icon,
  label,
  active,
  danger,
  leave,
  badge,
  onClick,
  btnRef,
  pressed,
  ariaHasPopup,
  ariaExpanded,
  disabled,
  title,
  S,
}) => {
  const [hov, setHov] = useState(false);
  // FIX (bug 3): the idle/hover state used to be hardcoded white-based rgba
  // with a fixed light-gray icon color, which was tuned for dark theme only
  // and became nearly invisible against the white panel in light theme.
  // Now it follows the same --im-ghost-bg / --im-text-soft variables the
  // rest of the room UI already uses, so icons stay visible in both themes.
  const bg = leave
    ? hov
      ? "#c5221f"
      : "#ea4335"
    : danger
      ? hov
        ? "#8c2b27"
        : "#5c2b29"
      : active
        ? hov
          ? "rgba(138,180,248,.30)"
          : "rgba(138,180,248,.18)"
        : hov
          ? "var(--im-ghost-bg)"
          : "var(--im-ghost-bg-soft)";
  const col = leave
    ? "#fff"
    : danger
      ? "#f6aea9"
      : active
        ? "#8ab4f8"
        : "var(--im-text-soft)";
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        ref={btnRef}
        className="im-ctrl-btn"
        onClick={onClick}
        disabled={disabled}
        title={title}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-label={label}
        aria-pressed={typeof pressed === "boolean" ? pressed : undefined}
        aria-haspopup={ariaHasPopup}
        aria-expanded={ariaExpanded}
        style={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          background: bg,
          color: col,
          border: danger
            ? "1px solid rgba(242,139,130,.3)"
            : active
              ? "1px solid rgba(138,180,248,.45)"
              : "1px solid var(--im-border-soft)",
          borderRadius: 14,
          padding: "10px 16px",

          fontSize: 10,
          fontWeight: 600,
          fontFamily: "inherit",
          letterSpacing: 0.2,
          flexShrink: 0,
          boxShadow: "none",
        }}
      >
        {icon}
        <span className="im-btn-label">{label}</span>
      </button>
      {!!badge && <span style={S.ctrlBadge}>{badge}</span>}
    </div>
  );
};
