import { useState } from "react";
import { Copy, Check, Link } from "lucide-react";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function CopyLinkBtn({ sessionId }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    const link = `${window.location.origin}/public/book-session/${sessionId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy public booking link"
      style={{
        padding: "5px 12px",
        borderRadius: 8,
        border: `1px solid ${copied ? "#34d39940" : "#a78bfa40"}`,
        background: copied ? "rgba(52,211,153,0.12)" : "rgba(167,139,250,0.12)",
        color: copied ? "#34d399" : "#a78bfa",
        fontSize: 10,
        fontWeight: FONT_WEIGHT.bold,
        cursor: "pointer",
        fontFamily: FONT_FAMILY,
        transition: "all 0.15s",
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      {copied ? (
        <>
          <Check size={10} /> Copied!
        </>
      ) : (
        <>
          <Copy size={10} /> Copy Link
        </>
      )}
    </button>
  );
}
