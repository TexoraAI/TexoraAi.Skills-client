import React from "react";
import "./roadmap-tokens.css";

/**
 * ProgressBar
 * A slim, accessible progress indicator in the roadmap.sh style.
 *
 * Props:
 *  - percentage (number 0-100)  primary prop
 *  - value      (number 0-100)  alias for `percentage` (back-compat with pages
 *                               that used <ProgressBar value={...} />)
 *  - showLabel  (bool)          show the "NN%" label on the right
 *  - size       ("sm"|"md"|"lg")
 *  - animated   (bool)          animate width transitions
 *  - color      (css color)     override the fill color (defaults to a
 *                               done/progress gradient based on value)
 */
export default function ProgressBar({
  percentage,
  value,
  showLabel = true,
  size = "md",
  animated = true,
  color,
}) {
  const raw = percentage != null ? percentage : value != null ? value : 0;
  const pct = Math.max(0, Math.min(100, Math.round(Number(raw) || 0)));

  const heights = { sm: 6, md: 9, lg: 13 };
  const h = heights[size] || heights.md;

  const fill =
    color ||
    (pct >= 100
      ? "var(--rm-done, #16a34a)"
      : pct === 0
        ? "var(--rm-border-strong, #b9b3a6)"
        : "linear-gradient(90deg, var(--rm-progress, #d97706), var(--rm-done, #16a34a))");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        fontFamily: "var(--rm-font-ui, system-ui, sans-serif)",
      }}
    >
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          flex: 1,
          height: h,
          background: "var(--rm-skipped-bg, #f3f4f6)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: fill,
            borderRadius: 999,
            transition: animated ? "width .45s ease" : "none",
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            minWidth: 34,
            textAlign: "right",
            fontSize: size === "lg" ? 14 : 12,
            fontWeight: 600,
            color: "var(--rm-text-muted, #6b7280)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {pct}%
        </span>
      )}
    </div>
  );
}
