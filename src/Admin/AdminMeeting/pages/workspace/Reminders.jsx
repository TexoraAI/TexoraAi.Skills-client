import React, { useMemo, useState } from "react";
import { Plus, Bell, Check } from "lucide-react";
import PageHead from "../../components/PageHead";
import { reminders as seedReminders } from "../../data/mockData";
import { useToast } from "../../components/Toast";

const TABS = ["All", "Upcoming", "Completed"];

export default function Reminders() {
  const [tab, setTab] = useState("All");
  const [items, setItems] = useState(seedReminders);
  const showToast = useToast();

  const toggle = (id) =>
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));

  const handleAdd = () => {
    const nextId = Math.max(0, ...items.map((r) => r.id)) + 1;
    setItems((prev) => [
      { id: nextId, title: `New reminder ${nextId}`, due: "Not scheduled yet", done: false, urgency: "New" },
      ...prev,
    ]);
    setTab("All");
    showToast("Reminder added");
  };

  const list = useMemo(() => {
    if (tab === "Upcoming") return items.filter((r) => !r.done);
    if (tab === "Completed") return items.filter((r) => r.done);
    return items;
  }, [tab, items]);

  return (
    <div className="ws-content">
      <PageHead
        title="Reminders"
        subtitle="Manage your reminders and never miss important tasks."
        actions={
          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={15} /> Add Reminder
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
        {list.length === 0 ? (
          <div className="empty-state">
            <Bell size={30} />
            <h3>No reminders here</h3>
            <p>Add a reminder to stay on top of your tasks.</p>
          </div>
        ) : (
          list.map((r) => (
            <div className="list-row" key={r.id}>
              <button
                className="icon-btn"
                style={{
                  background: r.done ? "var(--brand)" : "var(--card)",
                  color: r.done ? "#fff" : "var(--muted)",
                }}
                onClick={() => toggle(r.id)}
                title={r.done ? "Mark as pending" : "Mark as done"}
              >
                <Check size={14} />
              </button>
              <div className="list-row-main">
                <div className="title" style={{ textDecoration: r.done ? "line-through" : "none" }}>
                  {r.title}
                </div>
                <div className="meta">{r.due}</div>
              </div>
              {!r.done && <span className="badge">{r.urgency}</span>}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
