import React, { useState } from 'react';
import { Icon } from './Icons.jsx';

export default function PublishCard({ banner, onPublish, onSchedule }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [publishing, setPublishing] = useState(false);

  if (!banner) return null;

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onPublish(banner.id);
    } finally {
      setPublishing(false);
    }
  };

  const handleConfirmSchedule = async () => {
    if (!date) return;
    await onSchedule(banner.id, date, time);
    setShowSchedule(false);
  };

  return (
    <section className="section">
      <div className="publish-card">
        <div className="publish-info">
          <div className="stat-icon io">
            <Icon.Send size={20} />
          </div>
          <div>
            <h3>Ready to ship "{banner.name}"?</h3>
            <p>Save it for later, schedule it for a specific date, or push it live right now.</p>
            {showSchedule && (
              <div className="schedule-pop show">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                <button className="btn btn-primary btn-sm" onClick={handleConfirmSchedule}>
                  <Icon.Check size={14} /> Confirm schedule
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="publish-actions">
          <button className="btn btn-secondary" onClick={() => setShowSchedule((s) => !s)}>
            <Icon.Calendar size={15} /> Schedule
          </button>
          <button className="btn btn-green" onClick={handlePublish} disabled={publishing}>
            {publishing ? 'Publishing…' : (<><Icon.Send size={15} /> Publish Now</>)}
          </button>
        </div>
      </div>
    </section>
  );
}
