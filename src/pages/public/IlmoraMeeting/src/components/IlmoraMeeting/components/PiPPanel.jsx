import {
  Mic,
  MicOff,
} from "lucide-react";
import { VideoTrackEl } from "./VideoTrackEl";

/* ─── PiP floating panel ─────────────────────────────────────────── */
export function PiPPanel({
  track,
  isScreen,
  label,
  timer,
  micOn,
  onToggleMic,
  onReturn,
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Google Sans','Roboto',system-ui,sans-serif",
      }}
    >
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {track ? (
          <VideoTrackEl track={track} fit={isScreen ? "contain" : "cover"} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9aa0a6",
              fontSize: 13,
            }}
          >
            Meeting in progress…
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 8,
            fontSize: 11,
            color: "#fff",
            background: "rgba(0,0,0,.55)",
            padding: "3px 8px",
            borderRadius: 6,
          }}
        >
          {timer}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 6,
            left: 8,
            fontSize: 10,
            color: "#fff",
            background: "rgba(0,0,0,.55)",
            padding: "2px 7px",
            borderRadius: 6,
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          gap: 6,
          padding: 6,
          background: "#202124",
        }}
      >
        <button
          onClick={onToggleMic}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "6px 8px",
            borderRadius: 8,
            border: "none",
            background: micOn ? "rgba(255,255,255,.12)" : "#5c2b29",
            color: micOn ? "#e8eaed" : "#f6aea9",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {micOn ? <Mic size={13} /> : <MicOff size={13} />}
          {micOn ? "Mute" : "Unmute"}
        </button>
        <button
          onClick={onReturn}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "6px 8px",
            borderRadius: 8,
            border: "none",
            background: "rgba(138,180,248,.18)",
            color: "#8ab4f8",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Return to meeting
        </button>
      </div>
    </div>
  );
}
