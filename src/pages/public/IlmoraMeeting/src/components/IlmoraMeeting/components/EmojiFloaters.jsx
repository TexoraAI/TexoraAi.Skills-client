/* ─── reaction floaters ──────────────────────────────────────────── */
export function EmojiFloaters({ floaters, S }) {
  return (
    <div style={S.floaterLayer} aria-hidden="true">
      {floaters.map((f, i) => (
        <div
          key={f.id}
          style={{
            ...S.floater,
            left: `${10 + ((i * 13) % 74)}%`,
            animationDelay: `${(i % 4) * 0.08}s`,
          }}
        >
          <span style={S.floaterEmoji}>{f.emoji}</span>
          <span style={S.floaterName}>{f.name}</span>
        </div>
      ))}
    </div>
  );
}
