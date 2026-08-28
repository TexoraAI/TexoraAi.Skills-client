import { useState } from "react";
import { Save } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import { weeklyAvailability } from "./demoData";

export default function DemoAvailability({ onToast }) {
  const [rows, setRows] = useState(weeklyAvailability);

  const toggleDay = (day) =>
    setRows((r) => r.map((row) => (row.day === day ? { ...row, enabled: !row.enabled } : row)));

  const updateTime = (day, field, value) =>
    setRows((r) => r.map((row) => (row.day === day ? { ...row, [field]: value } : row)));

  return (
    <div className="ws-content">
      <DemoPageHead
        title="Availability"
        subtitle="Set the hours you're available for meetings and sessions."
        actions={
          <button className="btn-primary" onClick={() => onToast("Availability saved (demo)")}>
            <Save size={15} /> Save Changes
          </button>
        }
      />

      <section className="section-card">
        <div className="section-card-head">
          <h2>Weekly Hours</h2>
        </div>
        {rows.map((r) => (
          <div className="avail-day-row" key={r.day}>
            <div className="avail-day-name">{r.day}</div>
            <div className="avail-time-inputs">
              {r.enabled ? (
                <>
                  <input
                    type="time"
                    value={r.start}
                    onChange={(e) => updateTime(r.day, "start", e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={r.end}
                    onChange={(e) => updateTime(r.day, "end", e.target.value)}
                  />
                </>
              ) : (
                <span className="muted">Unavailable</span>
              )}
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={r.enabled} onChange={() => toggleDay(r.day)} />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </section>
    </div>
  );
}
