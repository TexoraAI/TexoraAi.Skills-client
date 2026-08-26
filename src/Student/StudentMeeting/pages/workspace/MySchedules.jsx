import React, { useState } from "react";
import { Plus, CalendarClock } from "lucide-react";
import PageHead from "../../components/PageHead";
import { mySchedules } from "../../data/mockData";
import { useWorkspaceModal } from "../../components/modals/ModalProvider";

const TABS = ["Upcoming", "Today", "This Week", "This Month"];

export default function MySchedules() {
  const [tab, setTab] = useState("Upcoming");
  const { openScheduleForm } = useWorkspaceModal();

  return (
    <div className="ws-content">
      <PageHead
        title="My Schedules"
        subtitle="View and manage your personal schedules."
        actions={
          <button className="btn-primary" onClick={() => openScheduleForm()}>
            <Plus size={15} /> Add Schedule
          </button>
        }
      />

      <div className="tab-strip">
        {TABS.map((t) => (
          <button key={t} className={`tab ${tab === t ? "is-active" : ""}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <section className="section-card">
        {mySchedules.length === 0 ? (
          <div className="empty-state">
            <CalendarClock size={30} />
            <h3>No schedules found</h3>
            <p>Your personal schedule items will appear here.</p>
          </div>
        ) : (
          mySchedules.map((s) => (
            <div className={`list-row type-${s.type.toLowerCase()}`} key={s.id}>
              <div className="list-row-date">
                <div className="mon">{s.date.split(" ")[0].toUpperCase()}</div>
                <div className="day">{s.date.split(" ")[1]}</div>
              </div>
              <div className="list-row-main">
                <div className="title">{s.title}</div>
                <div className="meta">
                  {s.time} · {s.mode}
                </div>
              </div>
              <span className="badge">{s.type}</span>
              <span className="badge info">{s.countdown}</span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
