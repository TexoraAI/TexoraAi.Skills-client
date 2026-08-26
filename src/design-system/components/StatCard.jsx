// ═══════════════════════════════════════════════════════════════
// StatCard — Global Design System
// GOLDEN REFERENCE: SuperAdmin "Onboarding Management" dashboard —
// flat white card, soft-tint icon badge, thin colored progress bar
// at the base. This replaces the old oversized gradient-card look
// (still available as STAT_COLORS/legacy if anything imports it
// directly, but no page should use it going forward).
//
// Every statistics card in the LMS (Student, Trainer, Admin,
// Business, Analytics, Reports, Attendance) renders through THIS
// component. Prop API is unchanged from the previous version, so
// existing call sites keep working — only the visual output changed.
//
// Usage:
//   <div className="stat-grid">
//     <StatCard stat={{ icon: BookOpen, label: "Active Courses", colorKey: "blue", numericValue: 12, change: "+2 this month" }} index={0} loading={loading} />
//   </div>
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect } from "react";
import { STAT_COLORS_FLAT } from "../tokens/colors";
import { FONT_FAMILY } from "../tokens/typography";
import { useAutoDarkMode } from "../hooks/useAutoDarkMode";

/** Count-up animation hook — identical behavior to previous version. */
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setVal(0);
      return;
    }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return val;
}

/**
 * @param {Object} props
 * @param {Object} props.stat - { icon: LucideIcon, label, colorKey, numericValue, isPercent?, change }
 *   colorKey accepts "blue" | "green" | "amber" | "orange" | "red" | "purple"
 *   ("orange" is treated as an alias of "amber" so old callers don't break).
 * @param {number} props.index - card position, used for stagger animation delay
 * @param {boolean} props.loading
 * @param {"light"|"dark"} [props.mode] - explicit override. If omitted,
 *   the card auto-detects the app's current theme (via the "dark" class
 *   / data-theme attribute on <html>), so it matches the page even if a
 *   call site forgets to pass this — same behavior across every
 *   dashboard (Student/Trainer/Admin/Business) with zero per-page wiring.
 */
const StatCard = ({ stat, index, loading, mode }) => {
  // const autoDark = useAutoDarkMode(mode != null);
  const autoDark = useAutoDarkMode();
  const resolvedMode = mode ?? (autoDark ? "dark" : "light");
  const Icon = stat.icon;
  const count = useCountUp(loading ? 0 : (stat.numericValue ?? 0));
  const [hov, setHov] = useState(false);
  const key = stat.colorKey === "orange" ? "amber" : stat.colorKey;
  const c = STAT_COLORS_FLAT[key] || STAT_COLORS_FLAT.blue;

  const cardBg = resolvedMode === "dark" ? "#111111" : "#ffffff";
  const border = resolvedMode === "dark" ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const valueColor = resolvedMode === "dark" ? "#ffffff" : "#0f172a";
  const labelColor = resolvedMode === "dark" ? "rgba(255,255,255,0.55)" : "#64748b";
  const changeColor = resolvedMode === "dark" ? "rgba(255,255,255,0.42)" : "#94a3b8";
  const shadow = hov
    ? resolvedMode === "dark" ? "0 10px 24px rgba(0,0,0,0.4)" : "0 8px 20px rgba(15,23,42,0.08)"
    : resolvedMode === "dark" ? "0 2px 10px rgba(0,0,0,0.3)" : "0 1px 6px rgba(15,23,42,0.04)";

  return (
    <div
      className="stat-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        animationDelay: `${index * 80}ms`,
        background: cardBg,
        border: `1px solid ${border}`,
        boxShadow: shadow,
        borderRadius: 14,
        padding: "18px 20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: "default",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
        transform: hov ? "translateY(-2px)" : "none",
        minWidth: 0,
        minHeight: 116,
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Icon badge — soft-tint circle, solid-color icon */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: c.soft,
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={c.solid} strokeWidth={2.2} />
      </div>

      <div>
        {loading ? (
          <div style={{ width: 56, height: 26, borderRadius: 6, background: resolvedMode === "dark" ? "rgba(255,255,255,0.1)" : "#f1f5f9" }} />
        ) : (
          <p style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, fontFamily: FONT_FAMILY, color: valueColor, margin: 0 }}>
            {stat.isPercent ? (stat.numericValue !== null ? `${stat.numericValue}%` : "—") : String(count)}
          </p>
        )}
        <p style={{ fontSize: 12.5, marginTop: 6, fontWeight: 600, color: labelColor, fontFamily: FONT_FAMILY, margin: "6px 0 0" }}>
          {stat.label}
        </p>
      </div>

      {stat.change && (
        <p style={{ fontSize: 11, fontWeight: 500, color: changeColor, fontFamily: FONT_FAMILY, margin: 0 }}>
          {stat.change}
        </p>
      )}

      {/* Base progress bar — thin colored strip matching the golden reference */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: resolvedMode === "dark" ? "rgba(255,255,255,0.06)" : "#f1f5f9",
        }}
      >
        <div
          style={{
            height: "100%",
            width: stat.isPercent && stat.numericValue != null ? `${Math.min(stat.numericValue, 100)}%` : "100%",
            background: c.solid,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
};

export default StatCard;
