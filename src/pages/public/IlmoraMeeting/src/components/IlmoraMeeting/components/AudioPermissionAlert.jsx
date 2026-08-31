import { AlertTriangle, RefreshCw } from "lucide-react";

export function AudioPermissionAlert({ error, onRetryMic, onRetryAudio }) {
  if (!error || typeof error !== "string") return null;

  const isMicError =
    error.includes("Microphone") || error.includes("microphone");
  const isAudioError = error.includes("Audio") || error.includes("audio");

  if (!isMicError && !isAudioError) return null;

  return (
    <div
      style={{
        padding: "14px 16px",
        backgroundColor: "#d32f2f",
        color: "white",
        borderRadius: "8px",
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "14px",
        lineHeight: "1.4",
      }}
    >
      <AlertTriangle size={18} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <strong>🎤 {isMicError ? "Microphone" : "Audio"} Issue</strong>
        <div style={{ fontSize: "13px", marginTop: "2px", opacity: 0.95 }}>
          {error}
        </div>
      </div>
      <button
        onClick={isMicError ? onRetryMic : onRetryAudio}
        style={{
          padding: "6px 12px",
          backgroundColor: "white",
          color: "#d32f2f",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flexShrink: 0,
        }}
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}
