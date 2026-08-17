import {
  ShieldAlert,
} from "lucide-react";
import { LB } from "../styles/lobbyStyles";
import { PJ } from "../styles/prejoinStyles";

export function DeniedScreen({ onRetry }) {
  return (
    <div style={PJ.root}>
      <div style={LB.card}>
        <ShieldAlert size={38} color="#f28b82" />
        <h2 style={LB.title}>Your request was declined</h2>
        <p style={LB.subtitle}>The host didn't let you into this meeting.</p>
        <button style={LB.cancelBtn} onClick={onRetry}>
          Try again
        </button>
      </div>
    </div>
  );
}
