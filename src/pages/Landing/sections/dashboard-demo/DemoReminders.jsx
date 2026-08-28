import { useState } from "react";
import { Bell, CheckSquare, Square, Clock, Plus } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import DemoRowMenu from "./DemoRowMenu";
import { reminders as initialReminders } from "./demoData";

const PRIORITY_BADGE = { High: "warn", Medium: "", Low: "info" };

export default function DemoReminders({ onToast }) {
  const [items, setItems] = useState(initialReminders);

  const toggleDone = (id) =>
    setItems((list) => list.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));

  const pending = items.filter((r) => !r.done);
  const done = items.filter((r) => r.done);

  return (
    <div className="ws-content">
      <DemoPageHead
        title="Reminders"
        subtitle="Nudges for the things you don't want to forget."
        actions={
          <button
            className="btn-primary"
            onClick={() => onToast("Demo mode — 'New Reminder' opens a form in the real product")}
          >
            <Plus size={15} /> New Reminder
          </button>
        }
      />

      <section className="section-card">
        <div className="section-card-head">
          <h2>Upcoming</h2>
        </div>
        {pending.length === 0 ? (
          <div className="empty-state">
            <Bell size={26} />
            <h3>You're all caught up</h3>
            <p>No pending reminders right now.</p>
          </div>
        ) : (
          pending.map((r) => (
            <div className="list-row" key={r.id}>
              <button className="icon-btn" onClick={() => toggleDone(r.id)} title="Mark done">
                <Square size={16} />
              </button>
              <div className="list-row-main">
                <div className="title">{r.title}</div>
                <div className="meta">
                  <Clock size={11} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                  {r.due}
                </div>
              </div>
              <span className={`badge ${PRIORITY_BADGE[r.priority]}`}>{r.priority}</span>
              <DemoRowMenu
                actions={[
                  { label: "Snooze 1 hour", onClick: () => onToast("Reminder snoozed (demo)") },
                  { label: "Edit", onClick: () => onToast("Demo mode — editing opens a form in the real product") },
                  { label: "Delete", onClick: () => setItems((list) => list.filter((x) => x.id !== r.id)) },
                ]}
              />
            </div>
          ))
        )}
      </section>

      {done.length > 0 && (
        <section className="section-card" style={{ marginTop: 20 }}>
          <div className="section-card-head">
            <h2>Completed</h2>
          </div>
          {done.map((r) => (
            <div className="list-row" key={r.id} style={{ opacity: 0.6 }}>
              <button className="icon-btn" onClick={() => toggleDone(r.id)} title="Mark as not done">
                <CheckSquare size={16} />
              </button>
              <div className="list-row-main">
                <div className="title" style={{ textDecoration: "line-through" }}>
                  {r.title}
                </div>
                <div className="meta">{r.due}</div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
