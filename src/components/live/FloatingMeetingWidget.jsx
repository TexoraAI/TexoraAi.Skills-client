import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Maximize2, MonitorPlay } from "lucide-react";
import { useLiveMeeting } from "@/context/LiveMeetingContext";

function TrackVideo({ track, mirrored, fit = "cover" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !track) return;
    track.attach(el);
    return () => { try { track.detach(el); } catch (_) {} };
  }, [track]);
  return (
    <video ref={ref} autoPlay playsInline muted
      style={{ width: "100%", height: "100%", objectFit: fit, transform: mirrored ? "scaleX(-1)" : "none", background: "#000", display: "block" }} />
  );
}

export default function FloatingMeetingWidget() {
  const navigate = useNavigate();
  const { activeMeeting, minimized, setMinimized, micOn, camOn, participants, toggleMic, toggleCam, leaveMeeting } = useLiveMeeting();

  const [pos, setPos] = useState({ x: window.innerWidth - 300, y: 80 });
  const dragRef = useRef(null);

  const onPointerDown = useCallback((e) => {
    const startX = e.clientX ?? e.touches?.[0]?.clientX;
    const startY = e.clientY ?? e.touches?.[0]?.clientY;
    dragRef.current = { startX, startY, origX: pos.x, origY: pos.y };
    const move = (ev) => {
      const cx = ev.clientX ?? ev.touches?.[0]?.clientX;
      const cy = ev.clientY ?? ev.touches?.[0]?.clientY;
      setPos({
        x: Math.min(Math.max(0, dragRef.current.origX + (cx - dragRef.current.startX)), window.innerWidth - 260),
        y: Math.min(Math.max(0, dragRef.current.origY + (cy - dragRef.current.startY)), window.innerHeight - 170),
      });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  }, [pos]);

  if (!activeMeeting || !minimized) return null;

  const screenSharer = participants.find((p) => p.screenTrack);
  const localCam = participants.find((p) => p.isLocal)?.cameraTrack;
  const mainTrack = screenSharer?.screenTrack || localCam
    || participants.find((p) => !p.isLocal && p.cameraTrack)?.cameraTrack || null;
  const isScreen = !!screenSharer?.screenTrack;

  const expand = () => {
    setMinimized(false);
    if (activeMeeting.role === "trainer") navigate(`/trainer/live-controls/${activeMeeting.sessionId}`);
    else navigate("/student/live-classes");
  };

  return (
    <div style={{ position: "fixed", left: pos.x, top: pos.y, width: 260, height: 168, borderRadius: 14,
      overflow: "hidden", background: "#0d1117", border: "1px solid rgba(255,255,255,.12)",
      boxShadow: "0 12px 40px rgba(0,0,0,.5)", zIndex: 100000, display: "flex", flexDirection: "column", userSelect: "none" }}>
      <div onMouseDown={onPointerDown} onTouchStart={onPointerDown} style={{ flex: 1, position: "relative", cursor: "grab", background: "#000" }}>
        {mainTrack ? (
          <TrackVideo track={mainTrack} fit={isScreen ? "contain" : "cover"} mirrored={!isScreen && mainTrack === localCam} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: 12 }}>
            Meeting in progress…
          </div>
        )}
        <div style={{ position: "absolute", top: 6, left: 6, display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,.55)", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, color: "#fff" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} /> LIVE
        </div>
        <button onClick={expand} title="Expand" style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: 7, border: "none", background: "rgba(0,0,0,.55)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Maximize2 size={12} />
        </button>
        {isScreen && (
          <div style={{ position: "absolute", bottom: 6, left: 6, display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#fff", background: "rgba(0,0,0,.55)", padding: "2px 7px", borderRadius: 6 }}>
            <MonitorPlay size={10} /> Presenting
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0, display: "flex", gap: 6, padding: 6, background: "#111826" }}>
        <button onClick={toggleMic} style={btn(!micOn)}>{micOn ? <Mic size={13} /> : <MicOff size={13} />}</button>
        <button onClick={toggleCam} style={btn(!camOn)}>{camOn ? <VideoIcon size={13} /> : <VideoOff size={13} />}</button>
        <button onClick={expand} style={{ ...btn(false), flex: 1, fontSize: 11, fontWeight: 700 }}>Expand</button>
        <button onClick={leaveMeeting} style={{ ...btn(false), background: "#7f1d1d", color: "#fca5a5" }}><PhoneOff size={13} /></button>
      </div>
    </div>
  );
}

const btn = (danger) => ({
  width: 32, height: 32, borderRadius: 9, border: "none",
  background: danger ? "#7f1d1d" : "rgba(255,255,255,.1)",
  color: danger ? "#fca5a5" : "#e2e8f0",
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
});