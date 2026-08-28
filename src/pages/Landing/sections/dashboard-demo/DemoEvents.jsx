import { useState } from "react";
import { Plus, Video } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import { eventBuckets } from "./demoData";

const TABS = Object.keys(eventBuckets);

export default function DemoEvents({ query, onToast }) {
  const [tab, setTab] = useState("Upcoming");

  const q = (query || "").trim().toLowerCase();
  const items = eventBuckets[tab].filter((e) =>
    q ? e.title.toLowerCase().includes(q) : true,
  );

  return (
    <div className="ws-content">
      <DemoPageHead
        title="Events"
        subtitle="Every session — upcoming, live, and completed."
        actions={
          <button className="btn-primary" onClick={() => onToast("Demo mode — 'Create Event' opens a full form in the real product")}>
            <Plus size={15} /> Create Event
          </button>
        }
      />

      <div className="toolbar-row">
        <div className="pill-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`pill-tab ${tab === t ? "is-active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="section-card empty-state">
          <Video size={26} />
          <h3>No {tab.toLowerCase()} events</h3>
          <p>{q ? `Nothing matches "${query}".` : "Nothing scheduled in this bucket right now."}</p>
        </div>
      ) : (
        <section className="section-card">
          {items.map((e) => (
            <div
              className={`list-row type-${e.type.toLowerCase()}`}
              key={e.id}
              onClick={() => onToast(`Opening "${e.title}" (demo)`)}
              style={{ cursor: "pointer" }}
            >
              <div className="list-row-date">
                <div className="mon">{e.date.split(" ")[0].toUpperCase()}</div>
                <div className="day">{e.date.split(" ")[1] || ""}</div>
              </div>
              <div className="list-row-main">
                <div className="title">{e.title}</div>
                <div className="meta">
                  {e.time} · {e.mode} · {e.registered} registered
                </div>
              </div>
              <span className={`badge ${tab === "Ongoing" ? "live" : ""}`}>{e.countdown}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
