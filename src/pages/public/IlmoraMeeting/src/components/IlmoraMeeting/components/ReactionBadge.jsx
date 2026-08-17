/* ─── reaction badge ─────────────────────────────────────────────── */
export function ReactionBadge({ emoji, style }) {
  if (!emoji) return null;

  return (
    <div style={style} className="im-reaction-badge" aria-hidden="true">
      {emoji}
    </div>
  );
}
