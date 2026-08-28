import { useState } from "react";
import { Sparkles, FileText } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import DemoRowMenu from "./DemoRowMenu";
import { summaries } from "./demoData";

const FILTERS = ["All", "Meetings", "Events"];

export default function DemoSummaries({ query, onToast }) {
  const [filter, setFilter] = useState("All");

  const q = (query || "").trim().toLowerCase();
  const items = summaries.filter((s) => {
    const matchesFilter = filter === "All" || s.type === filter;
    const matchesQuery = q ? s.title.toLowerCase().includes(q) : true;
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="ws-content">
      <DemoPageHead
        eyebrow="AI-generated"
        title="Summaries"
        subtitle="Auto-generated recaps, action items and highlights from your meetings."
        showLive={false}
      />

      <div className="toolbar-row">
        <div className="pill-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`pill-tab ${filter === f ? "is-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="section-card empty-state">
          <Sparkles size={26} />
          <h3>No summaries found</h3>
          <p>{q ? `Nothing matches "${query}".` : "Summaries appear here shortly after a meeting ends."}</p>
        </div>
      ) : (
        <section className="section-card">
          {items.map((s) => (
            <div className="list-row" key={s.id}>
              <div className="list-row-main">
                <div className="title">
                  <FileText size={13} style={{ verticalAlign: "-2px", marginRight: 6, color: "var(--brand)" }} />
                  {s.title}
                </div>
                <div className="meta">
                  {s.date} · {s.actionItems} action items · {s.length}
                </div>
              </div>
              <button
                className="btn-ghost btn-sm"
                onClick={() => onToast(`Opening summary for "${s.title}" (demo)`)}
              >
                View
              </button>
              <DemoRowMenu
                actions={[
                  { label: "Download PDF", onClick: () => onToast("Downloading summary (demo)") },
                  { label: "Share", onClick: () => onToast(`Sharing "${s.title}" (demo)`) },
                  { label: "Delete", onClick: () => onToast("Summary deleted (demo)") },
                ]}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
