// }

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import PageHead from "../../components/PageHead";
import { useToast } from "../../components/Toast";
import { useWorkspaceModal } from "../../components/modals/ModalProvider";
import {
  getEventsCalendar,
  updateEvent,
  deleteEvent,
} from "../../../../../services/eventService";
import { getMySchedules } from "../../../../../services/scheduleService";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const VIEWS = ["Month", "Week", "Day"];

function fmtTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${m} ${ampm}`;
}

export default function Calendar() {
  const today = new Date();
  const [monthOffset, setMonthOffset] = useState(0);
  const [view, setView] = useState("Month");
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [events, setEvents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();
  const { openEventForm } = useWorkspaceModal();
  const monthDate = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1,
  );
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const monthLabel = monthDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const monthParam = `${year}-${String(month + 1).padStart(2, "0")}`;

  const loadData = () => {
    setLoading(true);
    Promise.allSettled([getEventsCalendar(monthParam), getMySchedules()])
      .then(([ev, sc]) => {
        if (ev.status === "fulfilled") setEvents(ev.value.data || {});
        if (sc.status === "fulfilled") setSchedules(sc.value.data || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthOffset]);
  const byDay = useMemo(() => {
    const map = {};
    const add = (dateStr, obj) => {
      if (!dateStr) return;
      const d = new Date(dateStr + "T00:00:00");
      if (d.getFullYear() !== year || d.getMonth() !== month) return;
      const day = d.getDate();
      (map[day] = map[day] || []).push(obj);
    };
    Object.entries(events).forEach(([dateStr, dayEvents]) => {
      (dayEvents || []).forEach((e) =>
        add(dateStr, {
          id: e.id,
          title: e.title,
          time: fmtTime(e.startTime),
          kind: e.mode === "ONLINE" ? "Online session" : "Event",
          raw: e,
        }),
      );
    });
    schedules.forEach((s) =>
      add(s.date, {
        title: s.title,
        time: fmtTime(s.startTime),
        kind: s.type || "Schedule",
      }),
    );
    return map;
  }, [events, schedules, year, month]);

  const cells = useMemo(() => {
    const startWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [year, month]);

  const selectedItems = byDay[selectedDay] || [];
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="ws-content">
      <PageHead
        title="Calendar"
        subtitle="View and manage your schedule."
        actions={
          <button
            className="btn-primary"
            onClick={() => openEventForm(null, loadData)}
          >
            <Plus size={15} /> Create Event
          </button>
        }
      />

      <div className="cal-toolbar">
        <div className="cal-nav">
          <button
            className="icon-btn"
            onClick={() => setMonthOffset((m) => m - 1)}
          >
            <ChevronLeft size={15} />
          </button>
          {monthLabel}
          <button
            className="icon-btn"
            onClick={() => setMonthOffset((m) => m + 1)}
          >
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
              if (d === null)
                return <div className="full-month-cell is-empty" key={i} />;
              const isToday = isCurrentMonth && d === today.getDate();
              const isSelected = d === selectedDay;
              const evts = byDay[d] || [];
              return (
                <button
                  key={i}
                  type="button"
                  className={`full-month-cell ${isToday ? "is-today" : ""} ${
                    isSelected ? "is-selected" : ""
                  }`}
                  onClick={() => setSelectedDay(d)}
                >
                  <span className="num">{d}</span>
                  {evts.slice(0, 2).map((it, idx) => (
                    <span className="mini-evt" key={idx}>
                      {it.title}
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
            <h2>
              {monthLabel.split(" ")[0]} {selectedDay}, {year}
            </h2>
          </div>
          {loading ? (
            <p className="muted">Loading…</p>
          ) : selectedItems.length === 0 ? (
            <p className="muted">No events scheduled on this day.</p>
          ) : (
            selectedItems.map((it, idx) => (
              <div className="list-row" key={idx}>
                <div className="list-row-main">
                  <div className="title">{it.title}</div>
                  <div className="meta">
                    {it.time ? `${it.time} · ` : ""}
                    {it.kind}
                  </div>
                </div>
                {it.raw && (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn-ghost btn-sm"
                      onClick={() => openEventForm(it.raw, loadData)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-ghost btn-sm"
                      onClick={() => {
                        deleteEvent(it.raw.id)
                          .then(() => {
                            showToast(`Cancelled "${it.raw.title}"`);
                            loadData();
                          })
                          .catch((err) => {
                            console.error("Failed to delete event:", err);
                            showToast("Failed to cancel event");
                          });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          <button
            className="section-link"
            style={{ marginTop: 8 }}
            onClick={() => {
              setView("Day");
              showToast(
                `Opening full day view for ${monthLabel.split(" ")[0]} ${selectedDay}`,
              );
            }}
          >
            View full day →
          </button>
        </section>
      </div>
    </div>
  );
}
