import React, { useMemo, useState } from 'react';
import { Icon } from './Icons.jsx';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarSection({ banners, onEdit }) {
  const today = new Date();
  const [cursor, setCursor] = useState({ month: today.getMonth(), year: today.getFullYear() });

  const eventsByDay = useMemo(() => {
    const map = {};
    banners.forEach((b) => {
      if (!b.startDate || (b.status !== 'active' && b.status !== 'scheduled')) return;
      const d = new Date(b.startDate);
      if (d.getMonth() !== cursor.month || d.getFullYear() !== cursor.year) return;
      const day = d.getDate();
      if (!map[day]) map[day] = [];
      map[day].push(b);
    });
    return map;
  }, [banners, cursor]);

  const firstDay = new Date(cursor.year, cursor.month, 1).getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const isCurMonth = today.getMonth() === cursor.month && today.getFullYear() === cursor.year;

  const goPrev = () =>
    setCursor((c) => (c.month === 0 ? { month: 11, year: c.year - 1 } : { month: c.month - 1, year: c.year }));
  const goNext = () =>
    setCursor((c) => (c.month === 11 ? { month: 0, year: c.year + 1 } : { month: c.month + 1, year: c.year }));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(<div className="cal-cell empty" key={`e${i}`} />);
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurMonth && today.getDate() === day;
    const evts = eventsByDay[day] || [];
    cells.push(
      <div className={`cal-cell ${isToday ? 'today' : ''}`} key={day}>
        <div className="cal-daynum">{day}</div>
        {evts.slice(0, 1).map((b) => (
          <div
            className={`cal-event ${b.status}`}
            key={b.id}
            title={b.name}
            onClick={() => onEdit && onEdit(b)}
            style={{ cursor: onEdit ? 'pointer' : 'default' }}
          >
            {b.name}
          </div>
        ))}
        {evts.length > 1 && <div className="cal-event-more">+{evts.length - 1} more</div>}
      </div>
    );
  }

  return (
    <section className="section">
      <div className="section-head">
        <div>
          <div className="eyebrow">
            <Icon.Calendar size={13} /> Planning
          </div>
          <h2>Banner calendar</h2>
          <div className="sub">Every scheduled and active banner start date, at a glance.</div>
        </div>
      </div>
      <div className="cal-card">
        <div className="cal-head">
          <div className="cal-month">{MONTH_NAMES[cursor.month]} {cursor.year}</div>
          <div className="cal-nav">
            <button className="bs-icon-btn" onClick={goPrev} aria-label="Previous month">
              <Icon.ChevronLeft size={16} />
            </button>
            <button className="bs-icon-btn" onClick={goNext} aria-label="Next month">
              <Icon.ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="cal-grid">
          {DOWS.map((d) => (
            <div className="cal-dow" key={d}>{d}</div>
          ))}
          {cells}
        </div>
        <div className="cal-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: 'var(--green)' }} /> Active
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: 'var(--orange)' }} /> Scheduled
          </div>
        </div>
      </div>
    </section>
  );
}
