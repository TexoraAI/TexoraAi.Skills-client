import { useState } from "react";
import { Inbox, Send, Star, Paperclip } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import { emailStats, emailMessages } from "./demoData";

const FOLDERS = ["Inbox", "Sent", "Drafts"];

export default function DemoEmail({ query, onToast }) {
  const [folder, setFolder] = useState("Inbox");

  const q = (query || "").trim().toLowerCase();
  const items = emailMessages[folder].filter((m) =>
    q ? m.subject.toLowerCase().includes(q) || m.from.toLowerCase().includes(q) : true,
  );

  return (
    <div className="ws-content">
      <DemoPageHead
        title="Email"
        subtitle="Workspace notifications and messages in one inbox."
        actions={
          <button
            className="btn-primary"
            onClick={() => onToast("Demo mode — 'Compose' opens a full editor in the real product")}
          >
            <Send size={15} /> Compose
          </button>
        }
      />

      <div className="toolbar-row">
        <div className="pill-tabs">
          {FOLDERS.map((f) => (
            <button
              key={f}
              className={`pill-tab ${folder === f ? "is-active" : ""}`}
              onClick={() => setFolder(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="section-card empty-state">
          <Inbox size={26} />
          <h3>{folder} is empty</h3>
          <p>{q ? `Nothing matches "${query}".` : "Nothing here right now."}</p>
        </div>
      ) : (
        <section className="section-card">
          {items.map((m) => (
            <div
              className="list-row"
              key={m.id}
              onClick={() => onToast(`Opening "${m.subject}" (demo)`)}
              style={{ cursor: "pointer" }}
            >
              <div className="list-row-main">
                <div className="title">
                  {m.unread && (
                    <span className="badge live" style={{ marginRight: 6 }}>
                      New
                    </span>
                  )}
                  {m.subject}
                </div>
                <div className="meta">
                  {folder === "Sent" ? `To: ${m.from}` : `From: ${m.from}`} · {m.preview}
                  {m.hasAttachment && (
                    <Paperclip size={11} style={{ verticalAlign: "-1px", marginLeft: 4 }} />
                  )}
                </div>
              </div>
              {m.starred && (
                <Star size={14} style={{ color: "var(--accent)", fill: "var(--accent)" }} />
              )}
              <span className="badge muted">{m.time}</span>
            </div>
          ))}
        </section>
      )}

      <div className="email-stats-row">
        {emailStats.map((s) => (
          <div className="email-stat" key={s.label}>
            <div className="val">{s.value}</div>
            <div className="muted">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
