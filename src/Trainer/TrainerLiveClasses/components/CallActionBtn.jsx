import { useState } from "react";
import { Phone, X } from "lucide-react";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function CallActionBtn({ type, onClick }) {
  const [hov, setHov] = useState(false);
  const isDecline = type === "decline";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: isDecline
          ? hov
            ? "#991b1b"
            : "linear-gradient(135deg,#7f1d1d,#ef4444)"
          : hov
            ? "#14532d"
            : "linear-gradient(135deg,#14532d,#22c55e)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        boxShadow: isDecline
          ? "0 8px 32px rgba(239,68,68,0.4)"
          : "0 8px 32px rgba(34,197,94,0.45)",
        transition: "transform 0.2s",
        transform: hov ? "scale(1.06)" : "scale(1)",
      }}
    >
      {isDecline ? (
        <X size={24} color="white" />
      ) : (
        <Phone size={24} color="white" />
      )}
      <span
        style={{
          fontSize: 9,
          fontWeight: FONT_WEIGHT.semibold,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.1em",
          fontFamily: FONT_FAMILY,
        }}
      >
        {isDecline ? "Decline" : "Accept"}
      </span>
    </button>
  );
}
