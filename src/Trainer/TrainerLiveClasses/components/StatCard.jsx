// Thin adapter over the shared design-system <StatCard> (golden-reference
// flat card + soft-tint icon badge) so every call site in this page keeps
// passing { label, value, color, icon } exactly as before — only the
// rendered output changes, from the old oversized gradient tile to the
// same flat card AdminDashboard/Attendance.jsx use.
import { SharedStatCard } from "../data/theme";

// Maps this page's existing hex accents to the shared palette's colorKey
// buckets (blue/green/amber/red/purple) — presentation-only, no data change.
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

function toStat(s) {
  let numericValue = s.value;
  let isPercent = false;
  if (typeof s.value === "string" && s.value.trim().endsWith("%")) {
    isPercent = true;
    numericValue = parseInt(s.value, 10) || 0;
  } else if (typeof s.value === "string") {
    numericValue = parseInt(s.value, 10) || 0;
  }
  return {
    icon: s.icon,
    label: s.label,
    colorKey: HEX_TO_COLORKEY[s.color] || "blue",
    numericValue,
    isPercent,
  };
}

export default function StatCard({ stat, index, isDark, loading }) {
  return (
    <SharedStatCard
      stat={toStat(stat)}
      index={index}
      loading={!!loading}
      mode={typeof isDark === "boolean" ? (isDark ? "dark" : "light") : undefined}
    />
  );
}
