import { useState } from "react";
import { Mail, Phone, Plus, Users } from "lucide-react";
import DemoPageHead from "./DemoPageHead";
import { contacts } from "./demoData";

const FILTERS = ["All", "Mentor", "Student", "Team"];

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DemoContacts({ query, onQueryChange, onToast }) {
  const [filter, setFilter] = useState("All");

  const q = (query || "").trim().toLowerCase();
  const items = contacts.filter((c) => {
    const matchesFilter = filter === "All" || c.role === filter;
    const matchesQuery = q ? c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) : true;
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="ws-content">
      <DemoPageHead
        title="Contacts"
        subtitle="Mentors, students, and team members in your workspace."
        actions={
          <button className="btn-primary" onClick={() => onToast("Demo mode — 'Add Contact' opens a form in the real product")}>
            <Plus size={15} /> Add Contact
          </button>
        }
      />

      <div className="toolbar-row">
        <div className="search-box">
          <Users size={14} />
          <input
            placeholder="Search contacts…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
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
          <Users size={26} />
          <h3>No contacts found</h3>
          <p>Try a different search or filter.</p>
        </div>
      ) : (
        <div className="contact-grid">
          {items.map((c) => (
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
                <button className="icon-btn" title="Email" onClick={() => onToast(`Emailing ${c.name} (demo)`)}>
                  <Mail size={14} />
                </button>
                <button className="icon-btn" title="Call" onClick={() => onToast(`Calling ${c.name} (demo)`)}>
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
