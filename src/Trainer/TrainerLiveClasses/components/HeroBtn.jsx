import { useState } from "react";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function HeroBtn({ label, icon: Icon, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 16px",
        borderRadius: 10,
        border: `1px solid ${hov ? color + "55" : color + "30"}`,
        background: hov ? `${color}22` : `${color}12`,
        color,
        fontSize: 11,
        fontWeight: FONT_WEIGHT.bold,
        cursor: "pointer",
        fontFamily: FONT_FAMILY,
        transition: "all 0.2s",
      }}
    >
      <Icon size={13} /> {label}
    </button>
  );
}
