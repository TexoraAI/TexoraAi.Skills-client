import {
  Clock,
} from "lucide-react";
import { LB } from "../styles/lobbyStyles";
import { PJ } from "../styles/prejoinStyles";

/* ═════════════════════════════════════════════════════════════════
   LOBBY SCREEN — guest waiting for host to admit
═════════════════════════════════════════════════════════════════ */
export function LobbyScreen({ meetingInfo, onCancel }) {
  return (
    <div style={PJ.root}>
      <div style={LB.card}>
        <div style={LB.pulseWrap}>
          <div style={LB.pulseDot} />
          <Clock size={30} color="#8ab4f8" />
        </div>
        <h2 style={LB.title}>Asking to join…</h2>
        <p style={LB.subtitle}>
          You'll join <strong>{meetingInfo?.title || "this meeting"}</strong> as
          soon as the host lets you in.
        </p>
        <button style={LB.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
