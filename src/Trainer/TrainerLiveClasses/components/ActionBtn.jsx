import { useState } from "react";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function ActionBtn({ label, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "5px 12px",
        borderRadius: 8,
        border: `1px solid ${color}40`,
        background: hov ? `${color}25` : `${color}12`,
        color,
        fontSize: 10,
        fontWeight: FONT_WEIGHT.bold,
        cursor: "pointer",
        fontFamily: FONT_FAMILY,
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
