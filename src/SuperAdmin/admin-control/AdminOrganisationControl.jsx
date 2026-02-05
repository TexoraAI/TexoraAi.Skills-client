import React, { useState } from "react";

const initialOrgs = [
  { id: 1, name: "Innovate Labs", email: "admin@innovatelabs.com", city: "Bangalore", status: "Active", plan: "Enterprise", joinedDate: "Jan 12, 2024", admins: 12, students: 2340 },
  { id: 2, name: "TechVenture Inc.", email: "admin@techventure.com", city: "Hyderabad", status: "Active", plan: "Pro", joinedDate: "Feb 28, 2024", admins: 8, students: 1890 },
  { id: 3, name: "EduZone Academy", email: "info@eduzone.edu", city: "Delhi", status: "Active", plan: "Enterprise", joinedDate: "Mar 5, 2024", admins: 15, students: 1560 },
  { id: 4, name: "Future Skills Hub", email: "contact@futureskills.in", city: "Mumbai", status: "Pending", plan: "Pro", joinedDate: "Apr 18, 2024", admins: 5, students: 1230 },
  { id: 5, name: "CodeMasters Pro", email: "hello@codemasters.io", city: "Chennai", status: "Active", plan: "Basic", joinedDate: "May 2, 2024", admins: 3, students: 980 },
  { id: 6, name: "DataDrive Academy", email: "admin@datadrive.in", city: "Pune", status: "Suspended", plan: "Pro", joinedDate: "Jun 14, 2024", admins: 7, students: 740 },
  { id: 7, name: "AI Nexus Labs", email: "team@ainexus.org", city: "Bangalore", status: "Active", plan: "Enterprise", joinedDate: "Jul 22, 2024", admins: 10, students: 890 },
  { id: 8, name: "Quantum Learn", email: "info@quantumlearn.com", city: "Kolkata", status: "Pending", plan: "Basic", joinedDate: "Aug 30, 2024", admins: 2, students: 320 },
];

const emptyForm = { name: "", email: "", city: "", plan: "Basic", status: "Active" };

export default function AdminOrganisationControl() {
  const [orgs, setOrgs] = useState(initialOrgs);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = orgs.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (org) => {
    setEditId(org.id);
    setForm({ name: org.name, email: org.email, city: org.city, plan: org.plan, status: org.status });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editId) {
      setOrgs((prev) => prev.map((o) => (o.id === editId ? { ...o, ...form } : o)));
    } else {
      setOrgs((prev) => [
        ...prev,
        { id: Date.now(), ...form, joinedDate: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }), admins: 1, students: 0 },
      ]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    setOrgs((prev) => prev.filter((o) => o.id !== deleteId));
    setDeleteId(null);
  };

  const statusColor = (s) => {
    if (s === "Active") return { bg: "rgba(16,185,129,0.1)", text: "#10b981" };
    if (s === "Pending") return { bg: "rgba(245,158,11,0.1)", text: "#d97706" };
    return { bg: "rgba(239,68,68,0.1)", text: "#ef4444" };
  };

  const planColor = (p) => {
    if (p === "Enterprise") return { bg: "rgba(99,102,241,0.1)", text: "#6366f1" };
    if (p === "Pro") return { bg: "rgba(139,92,246,0.1)", text: "#7c3aed" };
    return { bg: "#f3f4f6", text: "#6b7280" };
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header Bar */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "20px 24px",
          border: "1px solid #eef0f2",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "18px",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f7f8fa", borderRadius: "10px", padding: "9px 14px", border: "1px solid #eef0f2" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search organisations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", color: "#374151", width: "200px", fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", gap: "6px" }}>
            {["All", "Active", "Pending", "Suspended"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  border: "none",
                  borderRadius: "8px",
                  padding: "7px 14px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: filterStatus === s ? "#6366f1" : "#f3f4f6",
                  color: filterStatus === s ? "#fff" : "#6b7280",
                  transition: "all 0.2s",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={openAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 20px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontSize: "13.5px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 3px 12px rgba(99,102,241,0.35)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 5px 18px rgba(99,102,241,0.45)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(99,102,241,0.35)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Organisation
        </button>
      </div>

      {/* Summary chips */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
        {[
          { label: "Total", count: orgs.length, color: "#6366f1" },
          { label: "Active", count: orgs.filter(o => o.status === "Active").length, color: "#10b981" },
          { label: "Pending", count: orgs.filter(o => o.status === "Pending").length, color: "#f59e0b" },
          { label: "Suspended", count: orgs.filter(o => o.status === "Suspended").length, color: "#ef4444" },
        ].map((chip, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "10px", padding: "8px 16px", border: "1px solid #eef0f2", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: chip.color }} />
            <span style={{ fontSize: "13px", color: "#6b7280" }}>{chip.label}:</span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>{chip.count}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["#", "Organisation", "Email", "City", "Plan", "Status", "Joined", "Actions"].map((h, i) => (
                  <th key={i} style={{ padding: "13px 18px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", borderBottom: "1px solid #f0f1f3", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((org, i) => {
                const sc = statusColor(org.status);
                const pc = planColor(org.plan);
                return (
                  <tr key={org.id} style={{ borderBottom: "1px solid #f5f6f7", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fafbfc"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 18px", fontSize: "13px", color: "#9ca3af", fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: `hsl(${org.id * 40 + 200}, 55%, 90%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: `hsl(${org.id * 40 + 200}, 55%, 38%)` }}>
                          {org.name[0]}
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{org.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280" }}>{org.email}</td>
                    <td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280" }}>{org.city}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px", background: pc.bg, color: pc.text }}>{org.plan}</span>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px", background: sc.bg, color: sc.text, display: "flex", alignItems: "center", gap: "5px", width: "fit-content" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: sc.text }} />
                        {org.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280" }}>{org.joinedDate}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {/* Edit */}
                        <button onClick={() => openEdit(org)} style={{ border: "1px solid #e5e7eb", borderRadius: "7px", width: "32px", height: "32px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280", transition: "all 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        {/* Delete */}
                        <button onClick={() => setDeleteId(org.id)} style={{ border: "1px solid #e5e7eb", borderRadius: "7px", width: "32px", height: "32px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280", transition: "all 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>No organisations found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "18px", width: "440px", maxWidth: "95vw", boxShadow: "0 24px 48px rgba(0,0,0,0.15)", overflow: "hidden" }}>
            {/* Modal Header */}
            <div style={{ padding: "24px 28px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>{editId ? "Edit Organisation" : "Add New Organisation"}</h2>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#9ca3af" }}>{editId ? "Update organisation details below" : "Fill in the details to create a new organisation"}</p>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ border: "none", background: "#f3f4f6", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: "18px" }}>×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Organisation Name", key: "name", placeholder: "e.g. Innovate Labs" },
                { label: "Email Address", key: "email", placeholder: "e.g. admin@company.com" },
                { label: "City", key: "city", placeholder: "e.g. Bangalore" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>{f.label}</label>
                  <input
                    type="text"
                    value={form[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", transition: "border-color 0.2s" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              ))}

              {/* Plan & Status side by side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Plan</label>
                  <select value={form.plan} onChange={(e) => setForm((p) => ({ ...p, plan: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", background: "#fff", fontFamily: "'Inter', sans-serif" }}>
                    <option value="Basic">Basic</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Status</label>
                  <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", background: "#fff", fontFamily: "'Inter', sans-serif" }}>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#374151", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                >Cancel</button>
                <button onClick={handleSave} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 3px 10px rgba(99,102,241,0.35)", transition: "transform 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >{editId ? "Save Changes" : "Create Organisation"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "18px", width: "380px", maxWidth: "95vw", padding: "28px", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: 700, color: "#111827" }}>Delete Organisation?</h3>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>This action cannot be undone. All associated data including admins, trainers and students will be permanently removed.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "#ef4444", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}