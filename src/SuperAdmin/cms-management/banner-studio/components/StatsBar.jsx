import React from 'react';
import { Icon } from './Icons.jsx';

function fmt(n) {
  return Number(n || 0).toLocaleString('en-US');
}

const DAY = 24 * 60 * 60 * 1000;

export default function StatsBar({ banners }) {
  const total = banners.length;
  const activeCount = banners.filter((b) => b.status === 'active').length;
  const scheduledCount = banners.filter((b) => b.status === 'scheduled').length;
  const draftCount = banners.filter((b) => b.status === 'draft').length;

  const newThisWeek = banners.filter((b) => {
    const t = new Date(b.updatedAt).getTime();
    return !Number.isNaN(t) && Date.now() - t <= 7 * DAY;
  }).length;

  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

  const stats = [
    {
      key: 'total',
      label: 'Total Banners',
      value: fmt(total),
      icon: <Icon.Layout />,
      tone: 'io',
      chip: newThisWeek > 0 ? { dir: 'up', text: `+${newThisWeek} this week` } : null,
    },
    {
      key: 'active',
      label: 'Active Banners',
      value: fmt(activeCount),
      icon: <Icon.Check />,
      tone: 'ia',
      chip: total ? { dir: 'up', text: `${pct(activeCount)}% live` } : null,
    },
    {
      key: 'scheduled',
      label: 'Scheduled Banners',
      value: fmt(scheduledCount),
      icon: <Icon.Calendar />,
      tone: 'is',
      chip: total ? { dir: 'up', text: `${pct(scheduledCount)}% of total` } : null,
    },
    {
      key: 'draft',
      label: 'Draft Banners',
      value: fmt(draftCount),
      icon: <Icon.Edit />,
      tone: 'id',
      chip: total ? { dir: 'down', text: `${pct(draftCount)}% of total` } : null,
    },
  ];

  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div className={`stat-card stat-card-${s.tone}`} key={s.key}>
          <div className="stat-top">
            <div className={`stat-icon ${s.tone}`}>{s.icon}</div>
            {s.chip && (
              <div className={`growth-chip ${s.chip.dir}`}>
                {s.chip.dir === 'up' ? <Icon.ArrowUp size={12} /> : <Icon.ArrowDown size={12} />}
                {s.chip.text}
              </div>
            )}
          </div>
          <div>
            <div className="stat-num">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
