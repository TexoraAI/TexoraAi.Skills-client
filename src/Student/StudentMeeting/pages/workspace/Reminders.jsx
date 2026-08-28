import React, { useEffect, useMemo, useState } from "react";
import { Plus, Bell, Check } from "lucide-react";
import PageHead from "../../components/PageHead";
import { useToast } from "../../components/Toast";
import {
  getMyReminders,
  dismissReminder,
} from "../../../../services/reminderService";

const TABS = ["All", "Upcoming", "Completed"];

function formatDue(reminder) {
  if (reminder.linkedTitle) return reminder.linkedTitle;
  if (reminder.eventId) return `Linked to event #${reminder.eventId}`;
  if (reminder.scheduleId) return `Linked to schedule #${reminder.scheduleId}`;
  return "Not linked";
}

function formatMeta(reminder) {
  const parts = [];
  if (reminder.linkedDate) parts.push(reminder.linkedDate);
  if (reminder.linkedStartTime) parts.push(reminder.linkedStartTime);
  parts.push(reminder.reminderTime);
  return parts.filter(Boolean).join(" · ");
}

export default function Reminders() {
  const [tab, setTab] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showToast = useToast();

  const loadReminders = () => {
    setLoading(true);
    setError(null);
    getMyReminders()
      .then((res) => setItems(res.data || []))
      .catch((err) => {
        console.error("Failed to load reminders:", err);
        setError("Could not load reminders. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const toggle = (id, status) => {
    if (status === "DISMISSED") return; // no "un-dismiss" endpoint
    dismissReminder(id)
      .then(() => {
        showToast("Reminder dismissed");
        loadReminders();
      })
      .catch((err) => {
        console.error("Failed to dismiss reminder:", err);
        showToast("Failed to dismiss reminder");
      });
  };

  const list = useMemo(() => {
    if (tab === "Upcoming") return items.filter((r) => r.status === "PENDING");
    if (tab === "Completed") return items.filter((r) => r.status !== "PENDING");
    return items;
  }, [tab, items]);

  return (
    <div className="ws-content">
      <PageHead
        title="Reminders"
        subtitle="Manage your reminders and never miss important tasks."
        actions={
          <button
            className="btn-primary"
            onClick={() =>
              showToast(
                "Reminders are created from an Event or Schedule's reminder field",
              )
            }
          >
            <Plus size={15} /> Add Reminder
          </button>
        }
      />

      <div className="tab-strip">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? "is-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <section className="section-card">
        {loading ? (
          <div className="empty-state">
            <p>Loading reminders...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <Bell size={30} />
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="btn-ghost btn-sm" onClick={loadReminders}>
              Retry
            </button>
          </div>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <Bell size={30} />
            <h3>No reminders here</h3>
            <p>Add a reminder to stay on top of your tasks.</p>
          </div>
        ) : (
          list.map((r) => {
            const done = r.status !== "PENDING";
            return (
              <div className="list-row" key={r.id}>
                <button
                  className="icon-btn"
                  style={{
                    background: done ? "var(--brand)" : "var(--card)",
                    color: done ? "#fff" : "var(--muted)",
                  }}
                  onClick={() => toggle(r.id, r.status)}
                  title={done ? "Already handled" : "Dismiss"}
                >
                  <Check size={14} />
                </button>
                <div className="list-row-main">
                  <div
                    className="title"
                    style={{ textDecoration: done ? "line-through" : "none" }}
                  >
                    {formatDue(r)}
                  </div>
                  <div className="meta">{formatMeta(r)}</div>
                </div>
                {!done && <span className="badge">{r.status}</span>}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
