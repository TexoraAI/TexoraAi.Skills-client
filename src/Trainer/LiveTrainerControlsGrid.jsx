import {
  MicOff,
  Mic,
  VideoOff,
  Video,
  Hand,
  Lock,
  MessageSquareOff,
  Radio,
  ScreenShareOff,
  ClipboardCheck,
  ScreenShare,
  LogOut,
} from "lucide-react";
import useRipple from "../components/live/useRipple.js";
import "./LiveTrainerControlsGrid.css";

const TONES = {
  red: { bg: "rgba(239,68,68,.12)", border: "rgba(239,68,68,.35)", color: "#f87171" },
  green: { bg: "rgba(34,197,94,.12)", border: "rgba(34,197,94,.35)", color: "#4ade80" },
  amber: { bg: "rgba(245,158,11,.12)", border: "rgba(245,158,11,.35)", color: "#fbbf24" },
  blue: { bg: "rgba(59,130,246,.12)", border: "rgba(59,130,246,.35)", color: "#93c5fd" },
  purple: { bg: "rgba(168,85,247,.12)", border: "rgba(168,85,247,.35)", color: "#d8b4fe" },
};

function ControlCard({ icon, label, tone, onClick }) {
  const t = TONES[tone];
  const ripple = useRipple(onClick);
  return (
    <button
      className="tc-card ripple-btn"
      style={{ "--tc-bg": t.bg, "--tc-border": t.border, "--tc-color": t.color }}
      onClick={ripple}
    >
      <span className="tc-icon">{icon}</span>
      <span className="tc-label">{label}</span>
    </button>
  );
}

export default function LiveTrainerControlsGrid({ flags, onCommand }) {
  return (
    <div className="tc-panel">
      <div className="tc-head">Trainer Controls</div>
      <div className="tc-grid">
        <ControlCard icon={<MicOff size={18} />} label="Mute All" tone="red" onClick={() => onCommand("allMuted", true)} />
        <ControlCard icon={<Mic size={18} />} label="Unmute All" tone="green" onClick={() => onCommand("allMuted", false)} />
        <ControlCard icon={<VideoOff size={18} />} label="Disable Cameras" tone="red" onClick={() => onCommand("camerasDisabled", true)} />
        <ControlCard icon={<Video size={18} />} label="Enable Cameras" tone="green" onClick={() => onCommand("camerasDisabled", false)} />
        <ControlCard icon={<Hand size={18} />} label="Lower All Hands" tone="amber" onClick={() => onCommand("handsLowered", true)} />
        <ControlCard icon={flags.locked ? <Lock size={18} /> : <Lock size={18} />} label="Lock Meeting" tone="purple" onClick={() => onCommand("locked", !flags.locked)} />
        <ControlCard icon={<MessageSquareOff size={18} />} label="Disable Chat" tone="red" onClick={() => onCommand("chatDisabled", true)} />
        <ControlCard icon={<Radio size={18} />} label="Allow Mic Requests" tone="green" onClick={() => onCommand("micRequestsAllowed", true)} />
        <ControlCard icon={<ScreenShareOff size={18} />} label="Block Screen Share" tone="red" onClick={() => onCommand("screenShareBlocked", true)} />
        <ControlCard icon={<ClipboardCheck size={18} />} label="Attendance" tone="blue" onClick={() => onCommand("attendance", true)} />
        <ControlCard icon={<ScreenShare size={18} />} label="Unblock Screen Share" tone="green" onClick={() => onCommand("screenShareBlocked", false)} />
        <ControlCard icon={<LogOut size={18} />} label="End Meeting" tone="red" onClick={() => onCommand("endMeeting", true)} />
      </div>
    </div>
  );
}
