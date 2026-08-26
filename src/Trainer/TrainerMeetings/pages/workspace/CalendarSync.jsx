import React, { useState } from "react";
import { CalendarClock, RefreshCw, CheckCircle2 } from "lucide-react";
import PageHead from "../../components/PageHead";
import { syncHistory } from "../../data/mockData";
import { useToast } from "../../components/Toast";

const DEFAULT_TOGGLES = [
  { key: "syncEvents", label: "Sync Events", desc: "Sync events from your calendar", on: true },
  { key: "syncMeetings", label: "Sync Meetings", desc: "Sync meetings and meeting links", on: true },
  { key: "syncReminders", label: "Sync Reminders", desc: "Sync reminders and notifications", on: true },
  { key: "twoWay", label: "Two-way Sync", desc: "Update events in both calendars", on: true },
];

export default function CalendarSync() {
  const [toggles, setToggles] = useState(DEFAULT_TOGGLES);
  const [syncing, setSyncing] = useState(false);
  const showToast = useToast();

  const flip = (key) =>
    setToggles((prev) => prev.map((t) => (t.key === key ? { ...t, on: !t.on } : t)));

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200);
  };

  return (
    <div className="ws-content">
      <PageHead title="Calendar Sync" subtitle="Sync your calendar to keep everything up to date." />

      <section className="section-card">
        <div className="section-card-head">
          <h2>Connected Calendar</h2>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "12px 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="integration-icon">
              <CalendarClock size={18} />
            </div>
            <div>
              <b style={{ fontSize: 13.5 }}>Google Calendar</b>
              <div className="muted">trainer.imam@ilmora.ai</div>
              <div className="connected-tag" style={{ marginTop: 2 }}>
                <span className="dot" /> Connected
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="muted">Last synced</div>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Just now</div>
            <button className="btn-ghost btn-sm" onClick={handleSyncNow}>
              <RefreshCw size={13} className={syncing ? "spin" : ""} /> {syncing ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card-head">
          <h2>Sync Settings</h2>
        </div>
        {toggles.map((t) => (
          <div className="settings-toggle-row" key={t.key}>
            <div>
              <b>{t.label}</b>
              <span>{t.desc}</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={t.on} onChange={() => flip(t.key)} />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </section>

      <section className="section-card">
        <div className="section-card-head">
          <h2>Sync History</h2>
          <button className="section-link" onClick={() => showToast("Opening full sync history")}>
            View all
          </button>
        </div>
        {syncHistory.map((h) => (
          <div className="sync-history-row" key={h.id}>
            <CheckCircle2 size={14} color="#16a34a" />
            {h.label}
            <span className="t">{h.time}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
