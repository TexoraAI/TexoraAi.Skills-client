export default function ToggleSwitch({ checked, onChange, color = "#22c55e" }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 99,
        cursor: "pointer",
        border: "none",
        outline: "none",
        position: "relative",
        background: checked ? color : "#94a3b8",
        flexShrink: 0,
        transition: "background 0.2s",
      }}
      role="switch"
      aria-checked={checked}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}
