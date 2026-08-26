import React, { useState } from "react";
import { CalendarDays, Video, Radio, MailCheck, Hash, Users } from "lucide-react";
import PageHead from "../../components/PageHead";
import { integrations as seedIntegrations } from "../../data/mockData";

const ICONS = {
  "Google Calendar": CalendarDays,
  Zoom: Video,
  "Google Meet": Radio,
  "Outlook Calendar": MailCheck,
  Slack: Hash,
  "Microsoft Teams": Users,
};

export default function Integrations() {
  const [items, setItems] = useState(seedIntegrations);

  const toggleConnect = (id) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i)));

  return (
    <div className="ws-content">
      <PageHead title="Integrations" subtitle="Connect your favorite tools and services." />

      <div className="integrations-grid">
        {items.map((i) => {
          const Icon = ICONS[i.name] || CalendarDays;
          return (
            <div className="integration-card" key={i.id}>
              <div className="integration-top">
                <div className="integration-icon">
                  <Icon size={19} />
                </div>
                <div>
                  <b>{i.name}</b>
                  {i.connected ? (
                    <span className="connected-tag">
                      <span className="dot" /> Connected
                    </span>
                  ) : (
                    <span className="muted">Not connected</span>
                  )}
                </div>
              </div>
              <p className="muted" style={{ margin: 0 }}>
                {i.desc}
              </p>
              <button
                className={i.connected ? "btn-ghost btn-sm" : "btn-primary btn-sm"}
                onClick={() => toggleConnect(i.id)}
              >
                {i.connected ? "Manage" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
