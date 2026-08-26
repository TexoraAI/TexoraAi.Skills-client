// Thin adapter over the shared design-system <StatCard> — same rationale
// as components/StatCard.jsx. Attendance metric tiles now render as the
// flat golden-reference card instead of the old gradient tile, while
// pages/PanelAttendanceReport.jsx keeps passing { label, value, color, icon }
// unchanged.
import { SharedStatCard } from "../data/theme";

const HEX_TO_COLORKEY = {
  "#f43f5e": "red",
  "#f59e0b": "amber",
  "#22d3ee": "blue",
  "#34d399": "green",
  "#a78bfa": "purple",
  "#3b82f6": "blue",
  "#16a34a": "green",
  "#ef4444": "red",
  "#7c3aed": "purple",
};

function toStat(m) {
  let numericValue = m.value;
  let isPercent = false;
  if (typeof m.value === "string" && m.value.trim().endsWith("%")) {
    isPercent = true;
    numericValue = parseInt(m.value, 10) || 0;
  } else if (typeof m.value === "string") {
    numericValue = parseInt(m.value, 10) || 0;
  }
  return {
    icon: m.icon,
    label: m.label,
    colorKey: HEX_TO_COLORKEY[m.color] || "blue",
    numericValue,
    isPercent,
  };
}

export default function AttMetricCard({ metric, index, isDark, loading }) {
  return (
    <SharedStatCard
      stat={toStat(metric)}
      index={index}
      loading={!!loading}
      mode={typeof isDark === "boolean" ? (isDark ? "dark" : "light") : undefined}
    />
  );
}
