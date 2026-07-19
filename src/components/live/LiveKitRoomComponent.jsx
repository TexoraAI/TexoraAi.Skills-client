import { useState, useCallback } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from "@livekit/components-react";
import { Disc2, CircleStop } from "lucide-react";

import "@livekit/components-styles";

import {
  startRecordingLive,
  stopRecordingLive,
} from "@/services/liveSessionService";

// ✅ NEW — sessionId added as required prop, initialRecording is optional
// (pass true if session was created with autoRecord ON, so the button
// reflects reality on mount instead of always defaulting to "off")
const LiveKitRoomComponent = ({
  token,
  sessionId,
  initialRecording = false,
  onLeave,
}) => {
  const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

  // ✅ NEW — local recording state + loading guard so double-clicks don't fire twice
  const [recording, setRecording] = useState(initialRecording);
  const [recToggling, setRecToggling] = useState(false);
  const [recError, setRecError] = useState(null);

  const toggleRecording = useCallback(async () => {
    if (!sessionId || recToggling) return;
    setRecError(null);
    setRecToggling(true);
    try {
      if (recording) {
        await stopRecordingLive(sessionId);
        setRecording(false);
      } else {
        await startRecordingLive(sessionId);
        setRecording(true);
      }
    } catch (err) {
      console.error(err);
      setRecError(err?.response?.data?.error || "Failed to toggle recording.");
    } finally {
      setRecToggling(false);
    }
  }, [sessionId, recording, recToggling]);

  return (
    <>
      {/* ── Global style overrides so VideoConference fills the screen ── */}
      <style>{`
        .lk-room-container,
        [data-lk-theme] {
          height: 100% !important;
          width: 100% !important;
          min-height: 0 !important;
        }
        .lk-chat {
          display: flex !important;
          flex-direction: column !important;
        }
        .lk-control-bar {
          flex-shrink: 0 !important;
          z-index: 100 !important;
        }
        .lk-participant-tile,
        .lk-focus-layout,
        .lk-grid-layout {
          min-height: 0 !important;
        }
        .lk-sidebar {
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "#000",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ✅ NEW — recording toggle bar, sits above the LiveKit UI */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            background: "#0d1117",
            borderBottom: "1px solid rgba(255,255,255,.08)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={toggleRecording}
            disabled={recToggling}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 8,
              border: `1px solid ${recording ? "rgba(239,68,68,.4)" : "rgba(148,163,184,.3)"}`,
              background: recording
                ? "rgba(239,68,68,.14)"
                : "rgba(255,255,255,.05)",
              color: recording ? "#f87171" : "#cbd5e1",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: recToggling ? "not-allowed" : "pointer",
              opacity: recToggling ? 0.6 : 1,
              transition: "all .15s",
            }}
          >
            {recording ? <CircleStop size={14} /> : <Disc2 size={14} />}
            {recToggling
              ? "Please wait…"
              : recording
                ? "Stop Recording"
                : "Start Recording"}
          </button>
          {recording && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#f87171",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#f87171",
                  display: "inline-block",
                }}
              />
              REC
            </span>
          )}
          {recError && (
            <span style={{ fontSize: 11, color: "#f87171", marginLeft: 8 }}>
              ⚠️ {recError}
            </span>
          )}
        </div>

        <LiveKitRoom
          token={token}
          serverUrl={serverUrl}
          connect={true}
          video={true}
          audio={true}
          onDisconnected={onLeave}
          style={{ height: "100%", width: "100%", flex: 1, minHeight: 0 }}
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </>
  );
};

export default LiveKitRoomComponent;