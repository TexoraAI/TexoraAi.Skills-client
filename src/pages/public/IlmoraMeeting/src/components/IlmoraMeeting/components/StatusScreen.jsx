import { LB } from "../styles/lobbyStyles";
import { PJ } from "../styles/prejoinStyles";

export function StatusScreen({ icon, title, subtitle }) {
  return (
    <div style={PJ.root}>
      <div style={LB.card}>
        {icon}
        <h2 style={LB.title}>{title}</h2>
        {subtitle && <p style={LB.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}
