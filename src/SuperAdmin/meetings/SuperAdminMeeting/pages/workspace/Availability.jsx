// import React, { useState } from "react";
// import PageHead from "../../components/PageHead";
// import { weeklyAvailability } from "../../data/mockData";

// export default function Availability() {
//   const [rows, setRows] = useState(weeklyAvailability);
//   const [breakStart, setBreakStart] = useState("13:00");
//   const [breakEnd, setBreakEnd] = useState("14:00");
//   const [saved, setSaved] = useState(false);

//   const updateRow = (idx, patch) =>
//     setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

//   const handleSave = () => {
//     setSaved(true);
//     setTimeout(() => setSaved(false), 1800);
//   };

//   return (
//     <div className="ws-content">
//       <PageHead
//         title="Availability"
//         subtitle="Set your available time slots."
//         actions={
//           <button className="btn-primary" onClick={handleSave}>
//             {saved ? "Saved ✓" : "Save Changes"}
//           </button>
//         }
//       />

//       <section className="section-card">
//         <div className="section-card-head">
//           <h2>Weekly Availability</h2>
//         </div>
//         {rows.map((r, idx) => (
//           <div className="avail-day-row" key={r.day}>
//             <div className="avail-day-name">{r.day}</div>
//             <div className="avail-time-inputs">
//               <input
//                 type="time"
//                 value={r.start}
//                 disabled={!r.enabled}
//                 onChange={(e) => updateRow(idx, { start: e.target.value })}
//               />
//               <span>to</span>
//               <input
//                 type="time"
//                 value={r.end}
//                 disabled={!r.enabled}
//                 onChange={(e) => updateRow(idx, { end: e.target.value })}
//               />
//               {!r.enabled && <span className="muted">Unavailable</span>}
//             </div>
//             <label className="toggle-switch">
//               <input
//                 type="checkbox"
//                 checked={r.enabled}
//                 onChange={() => updateRow(idx, { enabled: !r.enabled })}
//               />
//               <span className="toggle-slider" />
//             </label>
//           </div>
//         ))}
//       </section>

//       <section className="section-card">
//         <div className="section-card-head">
//           <h2>Break Time</h2>
//         </div>
//         <div className="avail-time-inputs">
//           <input type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)} />
//           <span>to</span>
//           <input type="time" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} />
//         </div>
//       </section>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import PageHead from "../../components/PageHead";
import { useToast } from "../../components/Toast";
import {
  getMyAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "../../../../../services/availabilityService";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DAY_LABELS = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export default function Availability() {
  // rows keyed by day: { slotId, start, end, enabled }
  const [rows, setRows] = useState(
    DAYS.map((day) => ({
      day,
      slotId: null,
      start: "09:00",
      end: "18:00",
      enabled: false,
    })),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  const loadAvailability = () => {
    setLoading(true);
    getMyAvailability()
      .then((res) => {
        const byDay = res.data || {}; // Map<dayOfWeek, AvailabilitySlot[]>
        setRows(
          DAYS.map((day) => {
            const slots = byDay[day] || [];
            const slot = slots[0];
            return slot
              ? {
                  day,
                  slotId: slot.id,
                  start: slot.startTime,
                  end: slot.endTime,
                  enabled: true,
                }
              : {
                  day,
                  slotId: null,
                  start: "09:00",
                  end: "18:00",
                  enabled: false,
                };
          }),
        );
      })
      .catch((err) => {
        console.error("Failed to load availability:", err);
        showToast("Could not load availability");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRow = (idx, patch) =>
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const handleSave = () => {
    setSaving(true);
    const ops = rows.map((r) => {
      if (r.enabled && !r.slotId) {
        // create
        return createAvailability({
          dayOfWeek: r.day,
          startTime: r.start,
          endTime: r.end,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          isRecurring: true,
        });
      }
      if (r.enabled && r.slotId) {
        // update
        return updateAvailability(r.slotId, {
          dayOfWeek: r.day,
          startTime: r.start,
          endTime: r.end,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          isRecurring: true,
        });
      }
      if (!r.enabled && r.slotId) {
        // delete
        return deleteAvailability(r.slotId);
      }
      return Promise.resolve();
    });

    Promise.all(ops)
      .then(() => {
        showToast("Availability saved");
        loadAvailability();
      })
      .catch((err) => {
        console.error("Failed to save availability:", err);
        showToast("Failed to save availability");
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="ws-content">
      <PageHead
        title="Availability"
        subtitle="Set your available time slots."
        actions={
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      <section className="section-card">
        <div className="section-card-head">
          <h2>Weekly Availability</h2>
        </div>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          rows.map((r, idx) => (
            <div className="avail-day-row" key={r.day}>
              <div className="avail-day-name">{DAY_LABELS[r.day]}</div>
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
          ))
        )}
      </section>
    </div>
  );
}
