import { useState } from "react";
import { Link2, Copy, Plus, Clock } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import DemoRowMenu from "./DemoRowMenu";
import { mySchedules } from "./demoData";

export default function DemoMySchedules({ onToast }) {
  const [schedules, setSchedules] = useState(mySchedules);

  const toggleActive = (id) =>
    setSchedules((list) => list.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  return (
    <div className="ws-content">
      <DemoPageHead
        title="My Schedules"
        subtitle="Booking pages people use to grab time with you."
        actions={
          <button
            className="btn-primary"
            onClick={() => onToast("Demo mode — 'New Schedule' opens a full form in the real product")}
          >
            <Plus size={15} /> New Schedule
          </button>
        }
      />

      <section className="section-card">
        {schedules.map((s) => (
          <div className="list-row" key={s.id}>
            <div className="list-row-main">
              <div className="title">{s.name}</div>
              <div className="meta">
                <Clock size={11} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                {s.duration} · {s.bookings} bookings this month ·{" "}
                <Link2 size={11} style={{ verticalAlign: "-2px" }} /> {s.slug}
              </div>
            </div>
            <span className={`badge ${s.active ? "live" : "muted"}`}>
              {s.active ? "Active" : "Paused"}
            </span>
            <button
              className="icon-btn"
              title="Copy link"
              onClick={() => onToast("Booking link copied (demo)")}
            >
              <Copy size={14} />
            </button>
            <DemoRowMenu
              actions={[
                { label: s.active ? "Pause" : "Activate", onClick: () => toggleActive(s.id) },
                { label: "Duplicate", onClick: () => onToast(`Duplicated "${s.name}" (demo)`) },
                { label: "Delete", onClick: () => onToast("Schedule deleted (demo)") },
              ]}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
