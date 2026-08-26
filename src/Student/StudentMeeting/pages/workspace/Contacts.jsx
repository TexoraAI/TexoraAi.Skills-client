import React, { useMemo, useState } from "react";
import { Search, UserPlus, Mail, Phone, Users } from "lucide-react";
import PageHead from "../../components/PageHead";
import { contacts } from "../../data/mockData";
import { useToast } from "../../components/Toast";
import { useWorkspaceModal } from "../../components/modals/ModalProvider";

const FILTERS = ["All Contacts", "Mentors", "Students", "Team"];

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Contacts() {
  const [filter, setFilter] = useState("All Contacts");
  const [query, setQuery] = useState("");
  const showToast = useToast();
  const { openContactForm } = useWorkspaceModal();

  const list = useMemo(() => {
    let source = contacts;
    if (filter !== "All Contacts") {
      const singular = filter.slice(0, -1); // "Mentors" -> "Mentor"
      source = source.filter((c) => c.role === singular || (filter === "Team" && c.role === "Team"));
    }
    if (query.trim()) {
      source = source.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
    }
    return source;
  }, [filter, query]);

  return (
    <div className="ws-content">
      <PageHead
        title="Contacts"
        subtitle="Manage your contacts and collaborators."
        actions={
          <button className="btn-primary" onClick={() => openContactForm()}>
            <UserPlus size={15} /> Add Contact
          </button>
        }
      />

      <div className="toolbar-row">
        <div className="search-box">
          <Search size={14} />
          <input placeholder="Search contacts..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="pill-tabs">
          {FILTERS.map((f) => (
            <button key={f} className={`pill-tab ${filter === f ? "is-active" : ""}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="section-card empty-state">
          <Users size={30} />
          <h3>No contacts found</h3>
          <p>Try a different search or filter.</p>
        </div>
      ) : (
        <div className="contact-grid">
          {list.map((c) => (
            <div className="contact-card" key={c.id}>
              <div className="contact-avatar" style={{ background: c.color }}>
                {initials(c.name)}
              </div>
              <div className="contact-info">
                <b>{c.name}</b>
                <span>
                  {c.role} · {c.email}
                </span>
              </div>
              <div className="contact-actions">
                <button className="icon-btn" title="Email" onClick={() => showToast(`Emailing ${c.name}`)}>
                  <Mail size={14} />
                </button>
                <button className="icon-btn" title="Call" onClick={() => showToast(`Calling ${c.name}`)}>
                  <Phone size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
