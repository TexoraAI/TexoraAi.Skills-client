import { useState } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import { calendarSyncAccounts, calendarSyncHistory } from "./demoData";

export default function DemoCalendarSync({ onToast }) {
  const [accounts, setAccounts] = useState(calendarSyncAccounts);
  const [syncing, setSyncing] = useState(false);

  const toggle = (id) =>
    setAccounts((list) => list.map((a) => (a.id === id ? { ...a, synced: !a.synced } : a)));

  const syncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      onToast("Calendars synced (demo)");
    }, 900);
  };

  return (
    <div className="ws-content">
      <DemoPageHead
        title="Calendar Sync"
        subtitle="Keep your workspace calendar in step with the calendars you already use."
        actions={
          <button className="btn-primary" onClick={syncNow} disabled={syncing}>
            <RefreshCw size={15} className={syncing ? "spin" : ""} /> {syncing ? "Syncing…" : "Sync Now"}
          </button>
        }
      />

      <section className="section-card">
        <div className="section-card-head">
          <h2>Connected Calendars</h2>
        </div>
        {accounts.map((a) => (
          <div className="calendar-sync-row" key={a.id} style={{ marginBottom: 10 }}>
            <div>
              <b>{a.name}</b>
              <div className="muted">{a.email}</div>
            </div>
            {a.synced ? (
              <span className="connected-tag">
                <span className="dot" /> Synced
              </span>
            ) : (
              <span className="muted">Paused</span>
            )}
            <label className="toggle-switch">
              <input type="checkbox" checked={a.synced} onChange={() => toggle(a.id)} />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </section>

      <section className="section-card" style={{ marginTop: 20 }}>
        <div className="section-card-head">
          <h2>Sync History</h2>
        </div>
        {calendarSyncHistory.map((h, idx) => (
          <div className="sync-history-row" key={idx}>
            <CheckCircle2 size={14} style={{ color: "var(--live)" }} />
            <span>{h.event}</span>
            <span className="t">{h.time}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
