import React, { useEffect, useState } from "react";
import { CalendarDays, MailCheck } from "lucide-react";
import PageHead from "../../components/PageHead";
import { getSyncStatus } from "../../../../../services/calendarSyncService";

export default function Integrations({ onNavigate }) {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStatus = () => {
    setLoading(true);
    getSyncStatus()
      .then((res) => setGoogleConnected(!!res.data?.connected))
      .catch((err) => {
        console.error("Failed to load calendar sync status:", err);
        setGoogleConnected(false);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const items = [
    {
      id: "google-calendar",
      name: "Google Calendar",
      desc: "Sync events and reminders",
      icon: CalendarDays,
      connected: googleConnected,
    },
    {
      id: "outlook-calendar",
      name: "Outlook Calendar",
      desc: "Sync with Outlook",
      icon: MailCheck,
      connected: false, // not implemented yet
    },
  ];

  return (
    <div className="ws-content">
      <PageHead
        title="Integrations"
        subtitle="Connect your favorite tools and services."
      />

      <div className="integrations-grid">
        {items.map((i) => {
          const Icon = i.icon;
          return (
            <div className="integration-card" key={i.id}>
              <div className="integration-top">
                <div className="integration-icon">
                  <Icon size={19} />
                </div>
                <div>
                  <b>{i.name}</b>
                  {loading ? (
                    <span className="muted">Checking...</span>
                  ) : i.connected ? (
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
                className={
                  i.connected ? "btn-ghost btn-sm" : "btn-primary btn-sm"
                }
                onClick={() => onNavigate?.("calendar-sync")}
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
