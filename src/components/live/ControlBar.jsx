import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  MessageSquare,
  Users,
  ShieldCheck,
  MoreHorizontal,
  PhoneOff,
  Hand,
  Smile,
} from "lucide-react";
import useRipple from "./useRipple.js";
import "./ControlBar.css";

function DockBtn({ icon, label, active, danger, badge, onClick }) {
  const ripple = useRipple(onClick);
  return (
    <button
      className={`cb-btn ripple-btn ${active ? "cb-btn--active" : ""} ${danger ? "cb-btn--danger" : ""}`}
      onClick={ripple}
      title={label}
    >
      <span className="cb-iconWrap">
        {icon}
        {badge ? <span className="cb-badge">{badge}</span> : null}
      </span>
      <span className="cb-label">{label}</span>
    </button>
  );
}

export default function ControlBar({
  isTrainer,
  micOn,
  camOn,
  screenOn,
  handRaised,
  chatCount,
  participantsCount,
  sidebarOpen,
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  onToggleChat,
  onToggleParticipants,
  onToggleHand,
  onReaction,
  onMore,
  onLeave,
}) {
  const rippleLeave = useRipple(onLeave);

  return (
    <div className="cb-bar">
      <div className="cb-dock glass">
        <div className="cb-left">
          <DockBtn icon={micOn ? <Mic size={18} /> : <MicOff size={18} />} label="Mic" active={micOn} onClick={onToggleMic} />
          <DockBtn icon={camOn ? <Video size={18} /> : <VideoOff size={18} />} label="Camera" active={camOn} onClick={onToggleCam} />
          <DockBtn icon={<ScreenShare size={18} />} label="Screen Share" active={screenOn} onClick={onToggleScreen} />
          <DockBtn icon={<MessageSquare size={18} />} label="Chat" badge={chatCount} onClick={onToggleChat} />
          <DockBtn icon={<Users size={18} />} label="Participants" badge={participantsCount} onClick={onToggleParticipants} />

          {isTrainer ? (
            <DockBtn icon={<ShieldCheck size={18} />} label="Trainer" active={sidebarOpen} onClick={onToggleParticipants} />
          ) : (
            <>
              <DockBtn icon={<Hand size={18} />} label="Raise Hand" active={handRaised} onClick={onToggleHand} />
              <DockBtn icon={<Smile size={18} />} label="Reactions" onClick={onReaction} />
            </>
          )}

          <DockBtn icon={<MoreHorizontal size={18} />} label="More" onClick={onMore} />
        </div>

        <div className="cb-divider" />

        <button className="cb-leaveBtn ripple-btn" onClick={rippleLeave}>
          <PhoneOff size={15} strokeWidth={2.4} />
          {isTrainer ? "End" : "Leave"}
        </button>
      </div>
    </div>
  );
}
