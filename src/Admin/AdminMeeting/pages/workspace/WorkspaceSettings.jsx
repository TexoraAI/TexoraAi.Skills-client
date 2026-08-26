import React, { useState } from "react";
import PageHead from "../../components/PageHead";
import { useToast } from "../../components/Toast";

const TABS = ["General", "Notifications", "Privacy", "Security"];

const NOTIF_TOGGLES = [
  { key: "email", label: "Email notifications", desc: "Receive updates about your events by email.", on: true },
  { key: "push", label: "Push notifications", desc: "Get real-time alerts on this device.", on: true },
  { key: "reminders", label: "Reminder alerts", desc: "Get notified before your events start.", on: true },
];

export default function WorkspaceSettings() {
  const [tab, setTab] = useState("General");
  const [workspaceName, setWorkspaceName] = useState("ILM ORA Admin Workspace");
  const [timezone, setTimezone] = useState("(GMT+05:30) Asia/Kolkata");
  const [language, setLanguage] = useState("English");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12 Hour");
  const [defaultView, setDefaultView] = useState("Overview");
  const [toggles, setToggles] = useState(NOTIF_TOGGLES);
  const [saved, setSaved] = useState(false);
  const [twoFactorOn, setTwoFactorOn] = useState(false);
  const showToast = useToast();

  const flip = (key) =>
    setToggles((prev) => prev.map((t) => (t.key === key ? { ...t, on: !t.on } : t)));

  const handleToggle2FA = () => {
    setTwoFactorOn((v) => !v);
    showToast(twoFactorOn ? "Two-factor authentication disabled" : "Two-factor authentication enabled");
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="ws-content">
      <PageHead
        title="Workspace Settings"
        subtitle="Manage your workspace preferences and settings."
        actions={
          <button className="btn-primary" onClick={handleSave}>
            {saved ? "Saved ✓" : "Save Changes"}
          </button>
        }
      />

      <div className="settings-tabs">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? "is-active" : ""} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === "General" && (
        <section className="section-card">
          <div className="form-grid">
            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>Workspace Name</label>
              <input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Timezone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option>(GMT+05:30) Asia/Kolkata</option>
                <option>(GMT+00:00) UTC</option>
                <option>(GMT-05:00) America/New_York</option>
                <option>(GMT+01:00) Europe/London</option>
              </select>
            </div>
            <div className="form-field">
              <label>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option>English</option>
                <option>Hindi</option>
                <option>Urdu</option>
              </select>
            </div>
            <div className="form-field">
              <label>Date Format</label>
              <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div className="form-field">
              <label>Time Format</label>
              <select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)}>
                <option>12 Hour</option>
                <option>24 Hour</option>
              </select>
            </div>
            <div className="form-field">
              <label>Default View</label>
              <select value={defaultView} onChange={(e) => setDefaultView(e.target.value)}>
                <option>Overview</option>
                <option>Events</option>
                <option>Calendar</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {tab === "Notifications" && (
        <section className="section-card">
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
      )}

      {tab === "Privacy" && (
        <section className="section-card">
          <div className="settings-toggle-row">
            <div>
              <b>Show my availability to others</b>
              <span>Let mentors and students see your free/busy status.</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="settings-toggle-row">
            <div>
              <b>Allow contact requests</b>
              <span>Let other users on the platform request to connect.</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
        </section>
      )}

      {tab === "Security" && (
        <section className="section-card">
          <div className="settings-toggle-row">
            <div>
              <b>Two-factor authentication</b>
              <span>
                Add an extra layer of security to your account.{" "}
                {twoFactorOn && <span className="connected-tag" style={{ marginLeft: 4 }}><span className="dot" /> Enabled</span>}
              </span>
            </div>
            <button className="btn-ghost btn-sm" onClick={handleToggle2FA}>
              {twoFactorOn ? "Disable" : "Enable"}
            </button>
          </div>
          <div className="settings-toggle-row">
            <div>
              <b>Active sessions</b>
              <span>Manage devices currently signed in to your workspace.</span>
            </div>
            <button className="btn-ghost btn-sm" onClick={() => showToast("Showing active sessions")}>
              Review
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
