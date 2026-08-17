// FIX (bug 5): "+N others" is now a real button — clicking it opens the
// People panel so every hidden participant is reachable, not just a dead label.
export function StripOverflow({ count, S, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...S.stripTile, ...S.stripOverflow, cursor: "pointer" }}
      className="im-strip-tile"
    >
      <span
        style={{ fontSize: 13, fontWeight: 700, color: "var(--im-text-soft)" }}
      >
        +{count}
      </span>
      <span style={{ fontSize: 9, color: "var(--im-text-mute)", marginTop: 2 }}>
        others · tap to view
      </span>
    </button>
  );
}
