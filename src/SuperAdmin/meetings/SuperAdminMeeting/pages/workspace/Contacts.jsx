// import React, { useMemo, useState } from "react";
// import { Search, UserPlus, Mail, Phone, Users } from "lucide-react";
// import PageHead from "../../components/PageHead";
// import { contacts } from "../../data/mockData";
// import { useToast } from "../../components/Toast";
// import { useWorkspaceModal } from "../../components/modals/ModalProvider";

// const FILTERS = ["All Contacts", "Mentors", "Students", "Team"];

// function initials(name) {
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();
// }

// export default function Contacts() {
//   const [filter, setFilter] = useState("All Contacts");
//   const [query, setQuery] = useState("");
//   const showToast = useToast();
//   const { openContactForm } = useWorkspaceModal();

//   const list = useMemo(() => {
//     let source = contacts;
//     if (filter !== "All Contacts") {
//       const singular = filter.slice(0, -1); // "Mentors" -> "Mentor"
//       source = source.filter((c) => c.role === singular || (filter === "Team" && c.role === "Team"));
//     }
//     if (query.trim()) {
//       source = source.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
//     }
//     return source;
//   }, [filter, query]);

//   return (
//     <div className="ws-content">
//       <PageHead
//         title="Contacts"
//         subtitle="Manage your contacts and collaborators."
//         actions={
//           <button className="btn-primary" onClick={() => openContactForm()}>
//             <UserPlus size={15} /> Add Contact
//           </button>
//         }
//       />

//       <div className="toolbar-row">
//         <div className="search-box">
//           <Search size={14} />
//           <input placeholder="Search contacts..." value={query} onChange={(e) => setQuery(e.target.value)} />
//         </div>
//         <div className="pill-tabs">
//           {FILTERS.map((f) => (
//             <button key={f} className={`pill-tab ${filter === f ? "is-active" : ""}`} onClick={() => setFilter(f)}>
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {list.length === 0 ? (
//         <div className="section-card empty-state">
//           <Users size={30} />
//           <h3>No contacts found</h3>
//           <p>Try a different search or filter.</p>
//         </div>
//       ) : (
//         <div className="contact-grid">
//           {list.map((c) => (
//             <div className="contact-card" key={c.id}>
//               <div className="contact-avatar" style={{ background: c.color }}>
//                 {initials(c.name)}
//               </div>
//               <div className="contact-info">
//                 <b>{c.name}</b>
//                 <span>
//                   {c.role} · {c.email}
//                 </span>
//               </div>
//               <div className="contact-actions">
//                 <button className="icon-btn" title="Email" onClick={() => showToast(`Emailing ${c.name}`)}>
//                   <Mail size={14} />
//                 </button>
//                 <button className="icon-btn" title="Call" onClick={() => showToast(`Calling ${c.name}`)}>
//                   <Phone size={14} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  Users,
  Pencil,
  Trash2,
} from "lucide-react";
import PageHead from "../../components/PageHead";
import { useToast } from "../../components/Toast";
import { useWorkspaceModal } from "../../components/modals/ModalProvider";
import {
  getMyContacts,
  deleteContact,
} from "../../../../../services/contactService";

const FILTERS = ["All Contacts", "Mentors", "Students", "Team"];

const AVATAR_COLORS = ["#7c3aed", "#0d9488", "#0ea5e9", "#db2777", "#b45309"];

function initials(firstName, lastName) {
  const f = (firstName || "").charAt(0);
  const l = (lastName || "").charAt(0);
  return (f + l).toUpperCase() || "?";
}

function colorFor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function Contacts() {
  const [filter, setFilter] = useState("All Contacts");
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showToast = useToast();
  const { openContactForm } = useWorkspaceModal();

  const loadContacts = () => {
    setLoading(true);
    setError(null);
    getMyContacts()
      .then((res) => setContacts(res.data || []))
      .catch((err) => {
        console.error("Failed to load contacts:", err);
        setError("Could not load contacts. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const list = useMemo(() => {
    let source = contacts;
    if (filter !== "All Contacts") {
      const singular = filter.slice(0, -1); // "Mentors" -> "Mentor"
      source = source.filter(
        (c) => c.role === singular || (filter === "Team" && c.role === "Team"),
      );
    }
    if (query.trim()) {
      source = source.filter((c) =>
        `${c.firstName} ${c.lastName || ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
    }
    return source;
  }, [contacts, filter, query]);

  return (
    <div className="ws-content">
      <PageHead
        title="Contacts"
        subtitle="Manage your contacts and collaborators."
        actions={
          <button
            className="btn-primary"
            onClick={() => openContactForm(null, loadContacts)}
          >
            <UserPlus size={15} /> Add Contact
          </button>
        }
      />

      <div className="toolbar-row">
        <div className="search-box">
          <Search size={14} />
          <input
            placeholder="Search contacts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

      {loading ? (
        <div className="section-card empty-state">
          <p>Loading contacts...</p>
        </div>
      ) : error ? (
        <div className="section-card empty-state">
          <Users size={30} />
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="btn-ghost btn-sm" onClick={loadContacts}>
            Retry
          </button>
        </div>
      ) : list.length === 0 ? (
        <div className="section-card empty-state">
          <Users size={30} />
          <h3>No contacts found</h3>
          <p>Try a different search or filter.</p>
        </div>
      ) : (
        <div className="contact-grid">
          {list.map((c) => (
            <div className="contact-card" key={c.id}>
              <div
                className="contact-avatar"
                style={{ background: colorFor(c.id) }}
              >
                {initials(c.firstName, c.lastName)}
              </div>
              <div className="contact-info">
                <b>
                  {c.firstName} {c.lastName || ""}
                </b>
                <span>
                  {c.organization ? `${c.organization} · ` : ""}
                  {c.email}
                </span>
              </div>
              <div className="contact-actions">
                <button
                  className="icon-btn"
                  title="Email"
                  onClick={() =>
                    showToast(`Emailing ${c.firstName} ${c.lastName || ""}`)
                  }
                >
                  <Mail size={14} />
                </button>
                <button
                  className="icon-btn"
                  title="Call"
                  onClick={() =>
                    showToast(`Calling ${c.firstName} ${c.lastName || ""}`)
                  }
                >
                  <Phone size={14} />
                </button>
                <button
                  className="icon-btn"
                  title="Edit"
                  onClick={() => openContactForm(c, loadContacts)}
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="icon-btn"
                  title="Delete"
                  onClick={() => {
                    deleteContact(c.id)
                      .then(() => {
                        showToast(
                          `Deleted "${c.firstName} ${c.lastName || ""}"`,
                        );
                        loadContacts();
                      })
                      .catch((err) => {
                        console.error("Failed to delete contact:", err);
                        showToast("Failed to delete contact");
                      });
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
