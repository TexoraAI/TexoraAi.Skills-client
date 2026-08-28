import { useState } from "react";
import { Save, ShieldAlert } from "lucide-react";
import DemoPageHead from "./DemoPageHead";

const TABS = ["General", "Notifications"];

const NOTIF_ROWS = [
  { key: "email", title: "Email notifications", desc: "Get emailed when events start or change." },
  { key: "reminders", title: "Reminders", desc: "Get pinged 10 minutes before a session." },
  { key: "digest", title: "Weekly digest", desc: "A Monday summary of the week ahead." },
];

export default function DemoSettings({ isDark, onToggleDark, onToast }) {
  const [tab, setTab] = useState("General");
  const [name, setName] = useState("ILM ORA Workspace");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [toggles, setToggles] = useState({ email: true, reminders: true, digest: false });

  const toggleNotif = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <div className="ws-content">
      <DemoPageHead
        title="Workspace Settings"
        subtitle="Manage how your workspace looks and notifies you."
        actions={
          <button className="btn-primary" onClick={() => onToast("Settings saved (demo)")}>
            <Save size={15} /> Save Changes
          </button>
        }
      />

      <div className="ws-demo-mode-strip">
        <ShieldAlert size={14} />
        You're viewing a demo workspace — changes here reset when you leave the page.
      </div>

      <div className="settings-tabs">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? "is-active" : ""} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === "General" ? (
        <section className="section-card">
          <div className="section-card-head">
            <h2>General</h2>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Workspace name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (ET)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              </select>
            </div>
          </div>

          <div className="settings-toggle-row">
            <div>
              <b>Dark theme</b>
              <span>Switch this demo workspace to dark mode.</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={isDark} onChange={onToggleDark} />
              <span className="toggle-slider" />
            </label>
          </div>
        </section>
      ) : (
        <section className="section-card">
          <div className="section-card-head">
            <h2>Notifications</h2>
          </div>
          {NOTIF_ROWS.map((row) => (
            <div className="settings-toggle-row" key={row.key}>
              <div>
                <b>{row.title}</b>
                <span>{row.desc}</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={toggles[row.key]}
                  onChange={() => toggleNotif(row.key)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
