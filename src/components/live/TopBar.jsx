import { Users, Wifi, ChevronDown, Settings, MoreVertical, PhoneOff, Grid3x3 } from "lucide-react";
import useRipple from "./useRipple.js";
import "./TopBar.css";

export default function TopBar({ elapsed, participantsCount, sessionTitle, network, onEnd, isTrainer }) {
  const rippleEnd = useRipple(onEnd);

  return (
    <div className="tb-bar">
      <div className="tb-left">
        <span className="tb-live">
          <span className="tb-liveDot" />
          LIVE
        </span>
        <span className="tb-pill tb-mono">{elapsed}</span>
        <span className="tb-pill">
          <Users size={14} />
          Participants <b>{participantsCount}</b>
        </span>
        <span className="tb-pill">
          Class: <b className="tb-accent">{sessionTitle}</b>
        </span>
      </div>

      <div className="tb-right">
        <span className="tb-pill tb-network">
          <Wifi size={14} />
          {network}%
        </span>
        <button className="tb-pill tb-viewBtn ripple-btn">
          <Grid3x3 size={14} />
          View
          <ChevronDown size={13} />
        </button>
        <button className="tb-iconBtn ripple-btn" title="Settings">
          <Settings size={16} />
        </button>
        <button className="tb-iconBtn ripple-btn" title="More">
          <MoreVertical size={16} />
        </button>
        <button className="tb-endBtn ripple-btn" onClick={rippleEnd}>
          <PhoneOff size={14} strokeWidth={2.4} />
          {isTrainer ? "End Class" : "Leave"}
        </button>
      </div>
    </div>
  );
}
