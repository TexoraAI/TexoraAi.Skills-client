import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import { calendarEvents } from "./demoData";

const DOW = ["S", "M", "T", "W", "T", "F", "S"];
// Fixed "today" (Aug 2026) so the demo always shows a populated month,
// matching the rest of the mock data (see PageHead's date pill).
const YEAR = 2026;
const MONTH = 7; // August (0-indexed)
const TODAY = 23;

export default function DemoCalendar({ onToast }) {
  const [selectedDay, setSelectedDay] = useState(TODAY);

  const cells = useMemo(() => {
    const startWeekday = new Date(YEAR, MONTH, 1).getDay();
    const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, []);

  const selectedItems = (calendarEvents[selectedDay] || []).map((title) => ({ title }));

  return (
    <div className="ws-content">
      <DemoPageHead
        title="Calendar"
        subtitle="View and manage your schedule."
        actions={
          <button className="btn-primary" onClick={() => onToast("Demo mode — 'Create Event' opens a full form in the real product")}>
            <Plus size={15} /> Create Event
          </button>
        }
      />

      <div className="cal-toolbar">
        <div className="cal-nav">
          <button className="icon-btn" onClick={() => onToast("Demo shows August 2026 only")}>
            <ChevronLeft size={15} />
          </button>
          August 2026
          <button className="icon-btn" onClick={() => onToast("Demo shows August 2026 only")}>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="content-grid-2">
        <section className="section-card">
          <div className="full-month-grid">
            {DOW.map((d, i) => (
              <div className="dow" key={`${d}-${i}`}>
                {d}
              </div>
            ))}
            {cells.map((d, i) => {
              if (d === null) return <div className="full-month-cell is-empty" key={i} />;
              const isToday = d === TODAY;
              const isSelected = d === selectedDay;
              const evts = calendarEvents[d] || [];
              return (
                <button
                  key={i}
                  type="button"
                  className={`full-month-cell ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""}`}
                  onClick={() => setSelectedDay(d)}
                >
                  <span className="num">{d}</span>
                  {evts.slice(0, 2).map((title, idx) => (
                    <span className="mini-evt" key={idx}>
                      {title}
                    </span>
                  ))}
                  {evts.length > 2 && (
                    <span className="muted" style={{ fontSize: 9.5 }}>
                      +{evts.length - 2} more
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="section-card cal-day-panel">
          <div className="section-card-head">
            <h2>August {selectedDay}, {YEAR}</h2>
          </div>
          {selectedItems.length === 0 ? (
            <p className="muted">No events scheduled on this day.</p>
          ) : (
            selectedItems.map((it, idx) => (
              <div className="list-row" key={idx}>
                <div className="list-row-main">
                  <div className="title">{it.title}</div>
                </div>
                <button className="btn-ghost btn-sm" onClick={() => onToast(`Opening "${it.title}" (demo)`)}>
                  View
                </button>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
