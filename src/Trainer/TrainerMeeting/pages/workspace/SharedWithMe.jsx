import React, { useMemo, useState } from "react";
import { Share2 } from "lucide-react";
import PageHead from "../../components/PageHead";
import { sharedWithMe } from "../../data/mockData";
import { useToast } from "../../components/Toast";

const TABS = ["Events", "Schedules"];

export default function SharedWithMe() {
  const [tab, setTab] = useState("Events");
  const showToast = useToast();

  const list = useMemo(() => sharedWithMe.filter((s) => s.kind === tab), [tab]);

  return (
    <div className="ws-content">
      <PageHead title="Shared with Me" subtitle="Events and schedules others have shared with you." />

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
            <Share2 size={30} />
            <h3>Nothing shared yet</h3>
            <p>Items shared with you by mentors, teams or students will show up here.</p>
          </div>
        ) : (
          list.map((s) => (
            <div className="list-row" key={s.id}>
              <div className="list-row-main">
                <div className="title">{s.title}</div>
                <div className="meta">
                  Shared by {s.sharedBy} · {s.when}
                </div>
              </div>
              <button className="btn-ghost btn-sm" onClick={() => showToast(`Opening "${s.title}"`)}>
                View
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
