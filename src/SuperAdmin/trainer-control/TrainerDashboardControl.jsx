import React, { useState } from "react";

const initialTrainers = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@texorai.com", org: "Innovate Labs", speciality: "Machine Learning", students: 142, rating: 4.8, status: "Active", joined: "Mar 2024" },
  { id: 2, name: "Priya Sharma", email: "priya@texorai.com", org: "TechVenture Inc.", speciality: "Web Development", students: 98, rating: 4.6, status: "Active", joined: "Apr 2024" },
  { id: 3, name: "Anil Mehta", email: "anil@texorai.com", org: "EduZone Academy", speciality: "Data Science", students: 115, rating: 4.9, status: "Active", joined: "Feb 2024" },
  { id: 4, name: "Sneha Patel", email: "sneha@texorai.com", org: "Future Skills Hub", speciality: "Cloud Computing", students: 67, rating: 4.3, status: "On Leave", joined: "Jun 2024" },
  { id: 5, name: "Vikram Das", email: "vikram@texorai.com", org: "CodeMasters Pro", speciality: "Mobile Dev", students: 54, rating: 4.5, status: "Active", joined: "May 2024" },
  { id: 6, name: "Kavita Nair", email: "kavita@texorai.com", org: "AI Nexus Labs", speciality: "NLP & AI", students: 89, rating: 4.7, status: "Active", joined: "Jan 2024" },
  { id: 7, name: "Sameer Khan", email: "sameer@texorai.com", org: "DataDrive Academy", speciality: "Cybersecurity", students: 43, rating: 4.1, status: "Inactive", joined: "Jul 2024" },
  { id: 8, name: "Deepa Reddy", email: "deepa@texorai.com", org: "Quantum Learn", speciality: "UI/UX Design", students: 71, rating: 4.4, status: "Active", joined: "Aug 2024" },
];

const orgs = ["All", "Innovate Labs", "TechVenture Inc.", "EduZone Academy", "Future Skills Hub", "CodeMasters Pro", "AI Nexus Labs", "DataDrive Academy", "Quantum Learn"];

const specialityColors = {
  "Machine Learning": { bg: "rgba(99,102,241,0.1)", text: "#6366f1" },
  "Web Development": { bg: "rgba(16,185,129,0.1)", text: "#10b981" },
  "Data Science": { bg: "rgba(245,158,11,0.1)", text: "#d97706" },
  "Cloud Computing": { bg: "rgba(236,72,153,0.1)", text: "#ec4899" },
  "Mobile Dev": { bg: "rgba(139,92,246,0.1)", text: "#7c3aed" },
  "NLP & AI": { bg: "rgba(59,130,246,0.1)", text: "#3b82f6" },
  "Cybersecurity": { bg: "rgba(239,68,68,0.1)", text: "#ef4444" },
  "UI/UX Design": { bg: "rgba(20,184,166,0.1)", text: "#14b8a6" },
};

export default function TrainerDashboardControl() {
  const [trainers, setTrainers] = useState(initialTrainers);
  const [search, setSearch] = useState("");
  const [orgFilter, setOrgFilter] = useState("All");
  const [assignModal, setAssignModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", org: orgs[1], speciality: "Machine Learning" });

  const filtered = trainers.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.speciality.toLowerCase().includes(search.toLowerCase());
    const matchOrg = orgFilter === "All" || t.org === orgFilter;
    return matchSearch && matchOrg;
  });

  const statusStyle = (s) => {
    if (s === "Active") return { bg: "rgba(16,185,129,0.1)", text: "#10b981" };
    if (s === "On Leave") return { bg: "rgba(245,158,11,0.1)", text: "#d97706" };
    return { bg: "rgba(156,163,175,0.15)", text: "#6b7280" };
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < full ? "#f59e0b" : i === full && half ? "url(#half)" : "none"} stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round">
            <defs><linearGradient id="half"><stop offset="50%" stopColor="#f59e0b" /><stop offset="50%" stopColor="none" /></linearGradient></defs>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
        <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "4px", fontWeight: 600 }}>{rating}</span>
      </div>
    );
  };

  const handleAddTrainer = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setTrainers((prev) => [...prev, { id: Date.now(), ...form, students: 0, rating: 0, status: "Active", joined: "Feb 2026" }]);
    setForm({ name: "", email: "", org: orgs[1], speciality: "Machine Learning" });
    setAddModal(false);
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Summary Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "Total Trainers", value: trainers.length, color: "#6366f1", icon: "👨‍🏫" },
          { label: "Active", value: trainers.filter((t) => t.status === "Active").length, color: "#10b981", icon: "✅" },
          { label: "Total Students", value: trainers.reduce((a, t) => a + t.students, 0), color: "#ec4899", icon: "🎓" },
          { label: "Avg Rating", value: (trainers.reduce((a, t) => a + t.rating, 0) / trainers.length).toFixed(1), color: "#f59e0b", icon: "⭐" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "14px", padding: "18px 20px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${s.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "#111827" }}>{s.value}</div>
              <div style={{ fontSize: "12.5px", color: "#9ca3af" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "#fff", borderRadius: "14px", padding: "16px 20px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f7f8fa", borderRadius: "10px", padding: "8px 14px", border: "1px solid #eef0f2" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search trainers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", color: "#374151", width: "180px", fontFamily: "'Inter', sans-serif" }} />
          </div>

          <select value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)} style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid #eef0f2", fontSize: "13px", color: "#374151", outline: "none", background: "#f7f8fa", fontFamily: "'Inter', sans-serif", cursor: "pointer" }}>
            {orgs.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <button onClick={() => setAddModal(true)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 18px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "13.5px", fontWeight: 600, cursor: "pointer", boxShadow: "0 3px 12px rgba(99,102,241,0.35)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Trainer
        </button>
      </div>

      {/* Trainer Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "16px" }}>
        {filtered.map((trainer) => {
          const sc = statusStyle(trainer.status);
          const sp = specialityColors[trainer.speciality] || { bg: "#f3f4f6", text: "#6b7280" };
          return (
            <div key={trainer.id} style={{ background: "#fff", borderRadius: "16px", padding: "22px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
            >
              {/* Top Row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: `hsl(${trainer.id * 45 + 180}, 55%, 88%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, color: `hsl(${trainer.id * 45 + 180}, 55%, 38%)` }}>
                    {trainer.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{trainer.name}</div>
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>{trainer.email}</div>
                  </div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "6px", background: sc.bg, color: sc.text }}>{trainer.status}</span>
              </div>

              {/* Speciality & Org */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px", background: sp.bg, color: sp.text }}>{trainer.speciality}</span>
                <span style={{ fontSize: "12px", color: "#9ca3af", padding: "4px 10px", borderRadius: "6px", background: "#f3f4f6" }}>{trainer.org}</span>
              </div>

              {/* Stats Row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #f0f1f3" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>Students</span>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{trainer.students}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>Rating</span>
                  {renderStars(trainer.rating)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>Joined</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{trainer.joined}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button onClick={() => setAssignModal(trainer)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #6366f1", background: "transparent", color: "#6366f1", fontSize: "12.5px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#6366f1"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6366f1"; }}
                >Assign Course</button>
                <button style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "60px", textAlign: "center", border: "1px solid #eef0f2" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#374151" }}>No trainers found</div>
          <div style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>Try adjusting your search or filters</div>
        </div>
      )}

      {/* Assign Course Modal */}
      {assignModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "18px", width: "440px", maxWidth: "95vw", padding: "28px", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>Assign Course</h3>
              <button onClick={() => setAssignModal(null)} style={{ border: "none", background: "#f3f4f6", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#6b7280" }}>×</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "#f7f8fa", borderRadius: "12px", marginBottom: "20px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: "#6366f1" }}>{assignModal.name.split(" ").map((n) => n[0]).join("")}</div>
              <div>
                <div style={{ fontWeight: 600, color: "#111827" }}>{assignModal.name}</div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>{assignModal.speciality}</div>
              </div>
            </div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Select Course</label>
            <select style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#374151", outline: "none", background: "#fff", boxSizing: "border-box" }}>
              <option>Advanced Machine Learning</option>
              <option>Python Fundamentals</option>
              <option>Deep Learning Specialization</option>
              <option>Cloud Architecture</option>
              <option>Web Dev Bootcamp</option>
            </select>
            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button onClick={() => setAssignModal(null)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
              <button style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }} onClick={() => setAssignModal(null)}>Assign</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Trainer Modal */}
      {addModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "18px", width: "440px", maxWidth: "95vw", padding: "28px", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>Add New Trainer</h3>
              <button onClick={() => setAddModal(false)} style={{ border: "none", background: "#f3f4f6", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#6b7280" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[{ label: "Full Name", key: "name", ph: "e.g. Rajesh Kumar" }, { label: "Email", key: "email", ph: "e.g. rajesh@texorai.com" }].map((f) => (
                <div key={f.key}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>{f.label}</label>
                  <input type="text" value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }} onFocus={(e) => (e.target.style.borderColor = "#6366f1")} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Organisation</label>
                  <select value={form.org} onChange={(e) => setForm((p) => ({ ...p, org: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#374151", outline: "none", background: "#fff", boxSizing: "border-box" }}>
                    {orgs.slice(1).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Speciality</label>
                  <select value={form.speciality} onChange={(e) => setForm((p) => ({ ...p, speciality: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#374151", outline: "none", background: "#fff", boxSizing: "border-box" }}>
                    {Object.keys(specialityColors).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button onClick={() => setAddModal(false)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleAddTrainer} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Add Trainer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}