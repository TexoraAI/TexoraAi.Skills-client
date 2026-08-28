// import React, { useState } from "react";
// import { PenSquare, Search, Filter, Mail as MailIcon } from "lucide-react";
// import PageHead from "../../components/PageHead";
// import { emails, emailStats } from "../../data/mockData";
// import { useToast } from "../../components/Toast";
// import { useWorkspaceModal } from "../../components/modals/ModalProvider";

// const TABS = ["Inbox", "Sent", "Drafts", "Scheduled"];

// export default function Email() {
//   const [tab, setTab] = useState("Inbox");
//   const [query, setQuery] = useState("");
//   const [openId, setOpenId] = useState(null);
//   const showToast = useToast();
//   const { openEmailComposer } = useWorkspaceModal();

//   const list = emails.filter((e) => e.subject.toLowerCase().includes(query.toLowerCase()));

//   return (
//     <div className="ws-content">
//       <PageHead
//         title="Email"
//         subtitle="Compose and manage your emails."
//         actions={
//           <button className="btn-primary" onClick={() => openEmailComposer()}>
//             <PenSquare size={15} /> Compose Email
//           </button>
//         }
//       />

//       <section className="stat-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
//         <div className="stat-card tone-pink">
//           <div className="stat-icon">
//             <MailIcon size={18} />
//           </div>
//           <div className="stat-value">{emailStats.unread}</div>
//           <div className="stat-label">Unread</div>
//         </div>
//         <div className="stat-card tone-brand">
//           <div className="stat-icon">
//             <MailIcon size={18} />
//           </div>
//           <div className="stat-value">{emailStats.sent}</div>
//           <div className="stat-label">Sent</div>
//         </div>
//         <div className="stat-card tone-accent">
//           <div className="stat-icon">
//             <MailIcon size={18} />
//           </div>
//           <div className="stat-value">{emailStats.drafts}</div>
//           <div className="stat-label">Drafts</div>
//         </div>
//         <div className="stat-card tone-info">
//           <div className="stat-icon">
//             <MailIcon size={18} />
//           </div>
//           <div className="stat-value">{emailStats.scheduled}</div>
//           <div className="stat-label">Scheduled</div>
//         </div>
//       </section>

//       <div className="tab-strip">
//         {TABS.map((t) => (
//           <button key={t} className={`tab ${tab === t ? "is-active" : ""}`} onClick={() => setTab(t)}>
//             {t}
//           </button>
//         ))}
//       </div>

//       <div className="toolbar-row">
//         <div className="search-box">
//           <Search size={14} />
//           <input placeholder="Search emails..." value={query} onChange={(e) => setQuery(e.target.value)} />
//         </div>
//         <button className="btn-ghost btn-sm" onClick={() => showToast("Filters panel opened")}>
//           <Filter size={13} /> Filters
//         </button>
//       </div>

//       <section className="section-card">
//         {tab !== "Inbox" ? (
//           <div className="empty-state">
//             <MailIcon size={30} />
//             <h3>No {tab.toLowerCase()} emails</h3>
//             <p>Emails you {tab.toLowerCase()} will appear here.</p>
//           </div>
//         ) : (
//           list.map((e) => (
//             <div
//               className="list-row"
//               key={e.id}
//               style={{ cursor: "pointer", opacity: e.unread ? 1 : 0.75 }}
//               onClick={() => setOpenId(openId === e.id ? null : e.id)}
//             >
//               <div className="list-row-main">
//                 <div className="title">
//                   {e.unread && (
//                     <span
//                       style={{
//                         display: "inline-block",
//                         width: 6,
//                         height: 6,
//                         borderRadius: 999,
//                         background: "var(--brand)",
//                         marginRight: 7,
//                       }}
//                     />
//                   )}
//                   {e.from} — {e.subject}
//                 </div>
//                 <div className="meta">{openId === e.id ? e.preview : e.preview.slice(0, 60) + "..."}</div>
//               </div>
//               <span className="badge muted">{e.time}</span>
//             </div>
//           ))
//         )}
//       </section>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { PenSquare, Search, Filter, Mail as MailIcon } from "lucide-react";
import PageHead from "../../components/PageHead";
import { useToast } from "../../components/Toast";
import { useWorkspaceModal } from "../../components/modals/ModalProvider";
import {
  getMyEmails,
  getEmailStats,
} from "../../../../services/emailService";

const TABS = ["Inbox", "Sent", "Drafts"];
const TAB_TO_STATUS = { Sent: "SENT", Drafts: "DRAFT" };

export default function Email() {
  const [tab, setTab] = useState("Inbox");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({ unread: 0, sent: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showToast = useToast();
  const { openEmailComposer } = useWorkspaceModal();

  const loadStats = () => {
    getEmailStats()
      .then((res) => setStats(res.data || { unread: 0, sent: 0, drafts: 0 }))
      .catch((err) => console.error("Failed to load email stats:", err));
  };

  const loadEmails = () => {
    setLoading(true);
    setError(null);
    const status = TAB_TO_STATUS[tab]; // undefined for "Inbox" -> all
    getMyEmails(status)
      .then((res) => setEmails(res.data || []))
      .catch((err) => {
        console.error("Failed to load emails:", err);
        setError("Could not load emails. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadEmails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const list = emails.filter((e) =>
    (e.subject || "").toLowerCase().includes(query.toLowerCase()),
  );

  const handleComposed = () => {
    loadEmails();
    loadStats();
  };

  return (
    <div className="ws-content">
      <PageHead
        title="Email"
        subtitle="Compose and manage your emails."
        actions={
          <button
            className="btn-primary"
            onClick={() => openEmailComposer(handleComposed)}
          >
            <PenSquare size={15} /> Compose Email
          </button>
        }
      />

      <section
        className="stat-grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        <div className="stat-card tone-pink">
          <div className="stat-icon">
            <MailIcon size={18} />
          </div>
          <div className="stat-value">{stats.unread}</div>
          <div className="stat-label">Unread</div>
        </div>
        <div className="stat-card tone-brand">
          <div className="stat-icon">
            <MailIcon size={18} />
          </div>
          <div className="stat-value">{stats.sent}</div>
          <div className="stat-label">Sent</div>
        </div>
        <div className="stat-card tone-accent">
          <div className="stat-icon">
            <MailIcon size={18} />
          </div>
          <div className="stat-value">{stats.drafts}</div>
          <div className="stat-label">Drafts</div>
        </div>
      </section>

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
            placeholder="Search emails..."
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
            <p>Loading emails...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <MailIcon size={30} />
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="btn-ghost btn-sm" onClick={loadEmails}>
              Retry
            </button>
          </div>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <MailIcon size={30} />
            <h3>No {tab.toLowerCase()} emails</h3>
            <p>Emails here will appear once available.</p>
          </div>
        ) : (
          list.map((e) => (
            <div
              className="list-row"
              key={e.id}
              style={{ cursor: "pointer" }}
              onClick={() => setOpenId(openId === e.id ? null : e.id)}
            >
              <div className="list-row-main">
                <div className="title">
                  {e.fromEmail} → {(e.toEmails || []).join(", ")} — {e.subject}
                </div>
                <div className="meta">
                  {openId === e.id
                    ? e.body
                    : (e.body || "").slice(0, 60) + "..."}
                </div>
              </div>
              <span className="badge muted">
                {e.sentAt
                  ? new Date(e.sentAt).toLocaleString()
                  : new Date(e.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
