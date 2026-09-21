// UsageBadge.jsx
//
// STYLE NOTE: UploadVideos.jsx doesn't use Tailwind at all — every
// component there takes a `c` color-token object (from getColors(isDark))
// and uses inline styles. Written to that pattern instead of shadcn
// Tailwind tokens (bg-card, border-border, text-muted-foreground, etc.),
// which don't exist in this project's Tailwind config.
//
// <UsageBadge storageUsedBytes={734003200} storageCapBytes={1073741824} label="Storage" c={c} />
// <UsageBadge used={2} limit={3} period="month" label="AI generations" c={c} />

function formatBytes(bytes) {
  if (bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 1024) return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

export default function UsageBadge({
  used,
  limit,
  period,
  storageUsedBytes,
  storageCapBytes,
  unlimited = false,
  label,
  c,
}) {
  const isStorage =
    storageUsedBytes !== undefined && storageCapBytes !== undefined;

  const isUnlimited = isStorage
    ? unlimited || storageCapBytes === null || storageCapBytes === Infinity
    : unlimited || limit === null || limit === undefined || limit === Infinity;

  if (isUnlimited) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 4,
          border: `1px solid ${c.cardBorder}`,
          background: c.cardBg,
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 500,
          color: c.textSub,
        }}
      >
        {label && <span>{label}</span>}
        <span style={{ color: c.accent, fontWeight: 700 }}>Unlimited</span>
      </div>
    );
  }

  const currentVal = isStorage ? storageUsedBytes : used;
  const capVal = isStorage ? storageCapBytes : limit;
  const ratio = capVal > 0 ? currentVal / capVal : 0;

  const barColor =
    ratio >= 1 ? c.errorColor : ratio >= 0.75 ? "#f59e0b" : c.accent;

  const valueText = isStorage
    ? `${formatBytes(storageUsedBytes)} / ${formatBytes(storageCapBytes)}`
    : `${used} / ${limit}${period ? ` this ${period}` : ""}`;

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 4,
        width: 224,
        borderRadius: 4,
        border: `1px solid ${c.cardBorder}`,
        background: c.cardBg,
        padding: "8px 12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {label && <span style={{ color: c.textPrimary }}>{label}</span>}
        <span style={{ color: c.textSub }}>{valueText}</span>
      </div>
      <div
        style={{
          height: 6,
          width: "100%",
          overflow: "hidden",
          borderRadius: 4,
          background: c.divider,
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 4,
            width: `${Math.min(ratio * 100, 100)}%`,
            background: barColor,
            transition: "width .2s",
          }}
        />
      </div>
    </div>
  );
}
