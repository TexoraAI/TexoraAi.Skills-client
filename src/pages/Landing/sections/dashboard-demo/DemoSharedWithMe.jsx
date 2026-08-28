import { Share2, ExternalLink } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import { sharedWithMe } from "./demoData";

export default function DemoSharedWithMe({ query, onToast }) {
  const q = (query || "").trim().toLowerCase();
  const items = sharedWithMe.filter((i) => (q ? i.title.toLowerCase().includes(q) : true));

  return (
    <div className="ws-content">
      <DemoPageHead
        title="Shared with Me"
        subtitle="Schedules, calendars and recordings other people have shared with you."
        showLive={false}
      />

      {items.length === 0 ? (
        <div className="section-card empty-state">
          <Share2 size={26} />
          <h3>Nothing shared with you yet</h3>
          <p>{q ? `Nothing matches "${query}".` : "When someone shares something, it'll show up here."}</p>
        </div>
      ) : (
        <section className="section-card">
          {items.map((i) => (
            <div className="list-row" key={i.id}>
              <div
                className="contact-avatar"
                style={{ background: i.color, width: 34, height: 34, fontSize: 12 }}
              >
                {i.sharedByInitials}
              </div>
              <div className="list-row-main">
                <div className="title">{i.title}</div>
                <div className="meta">
                  {i.type} · Shared by {i.sharedBy} · {i.time}
                </div>
              </div>
              <button
                className="btn-ghost btn-sm"
                onClick={() => onToast(`Opening "${i.title}" (demo)`)}
              >
                <ExternalLink size={13} /> Open
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
