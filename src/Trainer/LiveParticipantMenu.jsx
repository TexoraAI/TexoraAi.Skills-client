import { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, MessageSquare, MessageSquareOff, Hand, ScreenShareOff, Trash2 } from "lucide-react";
import "./LiveParticipantMenu.css";

export default function LiveParticipantMenu({ participant, onClose, onAction }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [onClose]);

  const items = [
    { label: "Mute User", icon: <MicOff size={13} />, command: "muteUser" },
    { label: "Unmute User", icon: <Mic size={13} />, command: "unmuteUser" },
    { label: "Disable Camera", icon: <VideoOff size={13} />, command: "disableCamera" },
    { label: "Enable Camera", icon: <Video size={13} />, command: "enableCamera" },
    { label: "Disable Chat", icon: <MessageSquareOff size={13} />, command: "disableChat" },
    { label: "Enable Chat", icon: <MessageSquare size={13} />, command: "enableChat" },
    ...(participant.handRaised
      ? [{ label: "Lower Hand", icon: <Hand size={13} />, command: "lowerHand" }]
      : []),
    ...(participant.presenting
      ? [{ label: "Stop Screen Share", icon: <ScreenShareOff size={13} />, command: "stopScreenShare" }]
      : []),
    { label: "Remove User", icon: <Trash2 size={13} />, command: "removeUser", danger: true },
  ];

  return (
    <div ref={ref} className="pm-menu">
      {items.map((it) => (
        <button
          key={it.label}
          className={`pm-item ${it.danger ? "pm-item--danger" : ""}`}
          onClick={() => onAction(participant, it)}
        >
          {it.icon}
          {it.label}
        </button>
      ))}
    </div>
  );
}
