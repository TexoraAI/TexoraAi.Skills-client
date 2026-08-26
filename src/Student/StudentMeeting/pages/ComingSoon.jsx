import React from "react";
import { Construction } from "lucide-react";

export default function ComingSoon({ label }) {
  return (
    <div className="ws-content">
      <div className="empty-state" style={{ paddingTop: 80 }}>
        <Construction size={34} />
        <h3>{label}</h3>
        <p>This section lives outside the Workspace feature set and isn't wired up yet.</p>
      </div>
    </div>
  );
}
