import React, { useState } from "react";
import PageHead from "../../components/PageHead";
import { weeklyAvailability } from "../../data/mockData";

export default function Availability() {
  const [rows, setRows] = useState(weeklyAvailability);
  const [breakStart, setBreakStart] = useState("13:00");
  const [breakEnd, setBreakEnd] = useState("14:00");
  const [saved, setSaved] = useState(false);

  const updateRow = (idx, patch) =>
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="ws-content">
      <PageHead
        title="Availability"
        subtitle="Set your available time slots."
        actions={
          <button className="btn-primary" onClick={handleSave}>
            {saved ? "Saved ✓" : "Save Changes"}
          </button>
        }
      />

      <section className="section-card">
        <div className="section-card-head">
          <h2>Weekly Availability</h2>
        </div>
        {rows.map((r, idx) => (
          <div className="avail-day-row" key={r.day}>
            <div className="avail-day-name">{r.day}</div>
            <div className="avail-time-inputs">
              <input
                type="time"
                value={r.start}
                disabled={!r.enabled}
                onChange={(e) => updateRow(idx, { start: e.target.value })}
              />
              <span>to</span>
              <input
                type="time"
                value={r.end}
                disabled={!r.enabled}
                onChange={(e) => updateRow(idx, { end: e.target.value })}
              />
              {!r.enabled && <span className="muted">Unavailable</span>}
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={r.enabled}
                onChange={() => updateRow(idx, { enabled: !r.enabled })}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </section>

      <section className="section-card">
        <div className="section-card-head">
          <h2>Break Time</h2>
        </div>
        <div className="avail-time-inputs">
          <input type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)} />
          <span>to</span>
          <input type="time" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} />
        </div>
      </section>
    </div>
  );
}
