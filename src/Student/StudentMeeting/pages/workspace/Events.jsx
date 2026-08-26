import React, { useMemo, useState } from "react";
import { Filter, Plus, Search, MoreVertical, CalendarX2 } from "lucide-react";
import PageHead from "../../components/PageHead";
import { eventStatusBuckets } from "../../data/mockData";
import { useToast } from "../../components/Toast";
import { useWorkspaceModal } from "../../components/modals/ModalProvider";

const TABS = ["All Events", "Upcoming", "Ongoing", "Completed", "Cancelled"];

export default function Events() {
  const [tab, setTab] = useState("Upcoming");
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const showToast = useToast();
  const { openEventForm } = useWorkspaceModal();

  const list = useMemo(() => {
    const source =
      tab === "All Events"
        ? Object.values(eventStatusBuckets).flat()
        : eventStatusBuckets[tab] || [];
    if (!query.trim()) return source;
    return source.filter((e) => e.title.toLowerCase().includes(query.toLowerCase()));
  }, [tab, query]);

  return (
    <div className="ws-content">
      <PageHead
        title="Events"
        subtitle="Create, manage and organize all your events in one place."
        actions={
          <button className="btn-primary" onClick={() => openEventForm()}>
            <Plus size={15} /> Create Event
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

      <div className="toolbar-row">
        <div className="search-box">
          <Search size={14} />
          <input
            placeholder="Search events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="btn-ghost btn-sm" onClick={() => showToast("Filters panel opened")}>
          <Filter size={13} /> Filters
        </button>
      </div>

      <section className="section-card">
        {list.length === 0 ? (
          <div className="empty-state">
            <CalendarX2 size={30} />
            <h3>No events here yet</h3>
            <p>Events in this category will show up once they're created or scheduled.</p>
          </div>
        ) : (
          list.map((e) => (
            <div className={`list-row type-${e.type.toLowerCase()}`} key={e.id}>
              <div className="list-row-date">
                <div className="mon">{e.date.split(" ")[0].toUpperCase()}</div>
                <div className="day">{e.date.split(" ")[1]}</div>
              </div>
              <div className="list-row-main">
                <div className="title">{e.title}</div>
                <div className="meta">
                  {e.time} · {e.mode} · {e.registered} registered
                </div>
              </div>
              <span className="badge">{e.type}</span>
              <span className={`badge ${e.status === "completed" ? "muted" : "info"}`}>{e.countdown}</span>
              <div className="row-menu-wrap">
                <button
                  className="row-menu-btn"
                  onClick={() => setOpenMenuId(openMenuId === e.id ? null : e.id)}
                >
                  <MoreVertical size={15} />
                </button>
                {openMenuId === e.id && (
                  <div className="row-menu-dropdown">
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        showToast(`Editing "${e.title}"`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        showToast(`Duplicated "${e.title}"`);
                      }}
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        showToast(`Cancelled "${e.title}"`);
                      }}
                    >
                      Cancel Event
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
