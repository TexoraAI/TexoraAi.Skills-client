import React, { useEffect, useMemo, useState } from "react";
import { Filter, Plus, Search, MoreVertical, CalendarX2 } from "lucide-react";
import PageHead from "../../components/PageHead";
import { useToast } from "../../components/Toast";
import { useWorkspaceModal } from "../../components/modals/ModalProvider";
// import { getMyEvents, deleteEvent } from "../../../../../services/eventService";
import {
  getMyEvents,
  deleteEvent,
  restoreEvent,
} from "../../../../../services/eventService";
const TABS = ["All Events", "Upcoming", "Ongoing", "Completed", "Cancelled"];

function formatTimeRange(startTime, endTime) {
  const fmt = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${h12}:${m} ${ampm}`;
  };
  return `${fmt(startTime)} - ${fmt(endTime)}`;
}

function formatDateParts(dateStr) {
  if (!dateStr) return { mon: "", day: "" };
  const d = new Date(dateStr);
  const mon = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  return { mon, day };
}

function deriveStatus(event) {
  if (event.status === "CANCELLED") return "cancelled";
  if (!event.date || !event.endTime) return "upcoming";
  const end = new Date(`${event.date}T${event.endTime}`);
  const now = new Date();
  if (end < now) return "completed";
  const start = new Date(`${event.date}T${event.startTime}`);
  if (start <= now && now <= end) return "ongoing";
  return "upcoming";
}
function getEventWindow(e) {
  if (!e.date || !e.startTime || !e.endTime) return null;
  const start = new Date(`${e.date}T${e.startTime}`);
  const end = new Date(`${e.date}T${e.endTime}`);
  return { start, end };
}

function renderEventJoinControl(e) {
  if (e.mode !== "ONLINE" || !e.meetingUrl) return null;

  const window = getEventWindow(e);
  const now = new Date();

  if (!window) {
    return (
      <a
        href={e.meetingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="badge info"
        onClick={(ev) => ev.stopPropagation()}
      >
        Join
      </a>
    );
  }

  const { start, end } = window;

  if (now < start) {
    const dateLabel = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const timeLabel = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return (
      <span className="badge" onClick={(ev) => ev.stopPropagation()}>
        Starts {dateLabel}, {timeLabel}
      </span>
    );
  }

  if (now >= start && now <= end) {
    return (
      <a
        href={e.meetingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="badge info"
        onClick={(ev) => ev.stopPropagation()}
      >
        Join now
      </a>
    );
  }

  return (
    <span className="badge" onClick={(ev) => ev.stopPropagation()}>
      Meeting ended
    </span>
  );
}
export default function Events() {
  const [tab, setTab] = useState("Upcoming");
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showToast = useToast();
  const { openEventForm } = useWorkspaceModal();

  const loadEvents = () => {
    setLoading(true);
    setError(null);
    getMyEvents()
      .then((res) => setEvents(res.data || []))
      .catch((err) => {
        console.error("Failed to load events:", err);
        setError("Could not load events. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const list = useMemo(() => {
    let source = events.map((e) => ({
      ...e,
      status: deriveStatus(e),
    }));
    if (tab !== "All Events") {
      source = source.filter((e) => e.status === tab.toLowerCase());
    }
    if (query.trim()) {
      source = source.filter((e) =>
        e.title.toLowerCase().includes(query.toLowerCase()),
      );
    }
    return source;
  }, [events, tab, query]);

  const handleDelete = (id, title) => {
    setOpenMenuId(null);
    deleteEvent(id)
      .then(() => {
        showToast(`Cancelled "${title}"`);
        loadEvents();
      })
      .catch((err) => {
        console.error("Failed to delete event:", err);
        showToast("Failed to cancel event");
      });
  };

  return (
    <div className="ws-content">
      <PageHead
        title="Events"
        subtitle="Create, manage and organize all your events in one place."
        actions={
          <button
            className="btn-primary"
            onClick={() => openEventForm(null, loadEvents)}
          >
            <Plus size={15} /> Create Event
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

      <div className="toolbar-row">
        <div className="search-box">
          <Search size={14} />
          <input
            placeholder="Search events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          className="btn-ghost btn-sm"
          onClick={() => showToast("Filters panel opened")}
        >
          <Filter size={13} /> Filters
        </button>
      </div>

      <section className="section-card">
        {loading ? (
          <div className="empty-state">
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <CalendarX2 size={30} />
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="btn-ghost btn-sm" onClick={loadEvents}>
              Retry
            </button>
          </div>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <CalendarX2 size={30} />
            <h3>No events here yet</h3>
            <p>
              Events in this category will show up once they're created or
              scheduled.
            </p>
          </div>
        ) : (
          list.map((e) => {
            const { mon, day } = formatDateParts(e.date);
            return (
              <div
                className={`list-row type-${(e.mode || "").toLowerCase()}`}
                key={e.id}
              >
                <div className="list-row-date">
                  <div className="mon">{mon}</div>
                  <div className="day">{day}</div>
                </div>
                <div className="list-row-main">
                  <div className="title">{e.title}</div>
                  <div className="meta">
                    {formatTimeRange(e.startTime, e.endTime)} ·{" "}
                    {e.mode === "ONLINE" ? "Online" : "In Person"} ·{" "}
                    {e.attendees ? e.attendees.length : 0} attendees
                  </div>
                </div>
                <span className="badge">
                  {e.mode === "ONLINE" ? "Online" : "In Person"}
                </span>
                <span
                  className={`badge ${e.status === "completed" ? "muted" : "info"}`}
                >
                  {e.status === "completed" ? "Ended" : e.status}
                </span>
                {renderEventJoinControl(e)}
                <div className="row-menu-wrap">
                  <button
                    className="row-menu-btn"
                    onClick={() =>
                      setOpenMenuId(openMenuId === e.id ? null : e.id)
                    }
                  >
                    <MoreVertical size={15} />
                  </button>
                  {openMenuId === e.id && (
                    <div className="row-menu-dropdown">
                      {e.status !== "cancelled" && (
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            openEventForm(e, loadEvents);
                          }}
                        >
                          Edit
                        </button>
                      )}
                      {e.status === "cancelled" ? (
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            restoreEvent(e.id)
                              .then(() => {
                                showToast(`Restored "${e.title}"`);
                                loadEvents();
                              })
                              .catch((err) => {
                                console.error("Failed to restore event:", err);
                                showToast("Failed to restore event");
                              });
                          }}
                        >
                          Restore Event
                        </button>
                      ) : (
                        <button onClick={() => handleDelete(e.id, e.title)}>
                          Cancel Event
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
