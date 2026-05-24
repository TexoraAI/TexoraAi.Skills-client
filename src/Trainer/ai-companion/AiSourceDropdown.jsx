// src/trainer/ai-companion/AiSourceDropdown.jsx
import { useState, useRef, useEffect } from "react";
import {
  Video,
  MessageCircle,
  Monitor,
  Mic,
  FileText,
  Upload,
  ChevronDown,
  Check,
} from "lucide-react";

const SOURCES = [
  { id: "MEETINGS", label: "Meetings", icon: Video, color: "#2563eb" },
  { id: "CHAT", label: "Chat", icon: MessageCircle, color: "#059669" },
  { id: "WHITEBOARD", label: "Whiteboard", icon: Monitor, color: "#7c3aed" },
  { id: "RECORDINGS", label: "Recordings", icon: Mic, color: "#dc2626" },
  { id: "DOCS", label: "Docs", icon: FileText, color: "#d97706" },
  { id: "UPLOADS", label: "Uploads", icon: Upload, color: "#0891b2" },
];

const DEFAULT_SELECTED = ["MEETINGS", "CHAT", "WHITEBOARD"];

export default function AiSourceDropdown({ isDark, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(DEFAULT_SELECTED);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setSelected(next);
    if (onChange) onChange(next);
  };

  const toggleAll = () => {
    const next =
      selected.length === SOURCES.length ? [] : SOURCES.map((s) => s.id);
    setSelected(next);
    if (onChange) onChange(next);
  };

  const bg = isDark ? "#1f2937" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "#6b7280";

  const allSelected = selected.length === SOURCES.length;
  const label =
    selected.length === 0
      ? "No sources"
      : selected.length === SOURCES.length
        ? "All sources"
        : `${selected.length} source${selected.length > 1 ? "s" : ""}`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px",
          borderRadius: 7,
          border: `1px solid ${border}`,
          background: bg,
          color: textPrimary,
          cursor: "pointer",
          fontSize: 12,
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500,
          transition: "all 0.15s",
        }}
      >
        {label}
        <ChevronDown size={13} color={textSecondary} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: 0,
            width: 220,
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: 12,
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.5)"
              : "0 8px 32px rgba(0,0,0,0.12)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {/* All sources toggle */}
          <button
            onClick={toggleAll}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "10px 14px",
              border: "none",
              borderBottom: `1px solid ${border}`,
              background: "transparent",
              cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                border: `2px solid ${allSelected ? "#2563eb" : border}`,
                background: allSelected ? "#2563eb" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
            >
              {allSelected && <Check size={10} color="#fff" />}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: textPrimary,
              }}
            >
              All sources
            </span>
          </button>

          {SOURCES.map((src) => {
            const Icon = src.icon;
            const isChecked = selected.includes(src.id);
            return (
              <button
                key={src.id}
                onClick={() => toggle(src.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "9px 14px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = isDark
                    ? "rgba(255,255,255,0.04)"
                    : "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: `2px solid ${isChecked ? src.color : border}`,
                    background: isChecked ? src.color : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                >
                  {isChecked && <Check size={10} color="#fff" />}
                </div>
                <Icon size={14} color={src.color} />
                <span
                  style={{
                    fontSize: 12,
                    color: textPrimary,
                  }}
                >
                  {src.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
