import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import PageHead from "../../components/PageHead";
import { calendarEvents } from "../../data/mockData";
import { useToast } from "../../components/Toast";
import { useWorkspaceModal } from "../../components/modals/ModalProvider";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const VIEWS = ["Month", "Week", "Day"];

export default function Calendar() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [view, setView] = useState("Month");
  const [selectedDay, setSelectedDay] = useState(23);
  const showToast = useToast();
  const { openEventForm } = useWorkspaceModal();

  const base = new Date(2026, 7, 1); // August 2026
  const monthDate = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const monthLabel = monthDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const cells = useMemo(() => {
    const startWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [year, month]);

  const selectedEvents = calendarEvents[selectedDay] || [];

  return (
    <div className="ws-content">
      <PageHead
        title="Calendar"
        subtitle="View and manage your schedule."
        actions={
          <button className="btn-primary" onClick={() => openEventForm()}>
            <Plus size={15} /> Create Event
          </button>
        }
      />

      <div className="cal-toolbar">
        <div className="cal-nav">
          <button className="icon-btn" onClick={() => setMonthOffset((m) => m - 1)}>
            <ChevronLeft size={15} />
          </button>
          {monthLabel}
          <button className="icon-btn" onClick={() => setMonthOffset((m) => m + 1)}>
            <ChevronRight size={15} />
          </button>
        </div>
        <div className="pill-tabs">
          {VIEWS.map((v) => (
            <button
              key={v}
              className={`pill-tab ${view === v ? "is-active" : ""}`}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="content-grid-2">
        <section className="section-card">
          <div className="full-month-grid">
            {DOW.map((d) => (
              <div className="dow" key={d}>
                {d}
              </div>
            ))}
            {cells.map((d, i) => {
              if (d === null) return <div className="full-month-cell is-empty" key={i} />;
              const isToday = year === 2026 && month === 7 && d === 23;
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
                  {evts.slice(0, 2).map((t, idx) => (
                    <span className="mini-evt" key={idx}>
                      {t}
                    </span>
                  ))}
                  {evts.length > 2 && <span className="muted" style={{ fontSize: 9.5 }}>+{evts.length - 2} more</span>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="section-card cal-day-panel">
          <div className="section-card-head">
            <h2>
              {monthLabel.split(" ")[0]} {selectedDay}, {year}
            </h2>
          </div>
          {selectedEvents.length === 0 ? (
            <p className="muted">No events scheduled on this day.</p>
          ) : (
            selectedEvents.map((title, idx) => (
              <div className="list-row" key={idx}>
                <div className="list-row-main">
                  <div className="title">{title}</div>
                  <div className="meta">Online session</div>
                </div>
              </div>
            ))
          )}
          <button
            className="section-link"
            style={{ marginTop: 8 }}
            onClick={() => {
              setView("Day");
              showToast(`Opening full day view for ${monthLabel.split(" ")[0]} ${selectedDay}`);
            }}
          >
            View full day →
          </button>
        </section>
      </div>
    </div>
  );
}
