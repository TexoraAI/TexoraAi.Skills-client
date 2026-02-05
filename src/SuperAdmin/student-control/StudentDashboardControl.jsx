import React, { useState } from "react";

const initialStudents = [
  { id: 1, name: "Arjun Mehta", email: "arjun@student.com", org: "Innovate Labs", course: "Machine Learning", progress: 78, grade: "A", status: "Enrolled", joined: "Jan 2026" },
  { id: 2, name: "Zara Ahmed", email: "zara@student.com", org: "TechVenture Inc.", course: "Web Development", progress: 45, grade: "B+", status: "Enrolled", joined: "Jan 2026" },
  { id: 3, name: "Rahul Verma", email: "rahul@student.com", org: "EduZone Academy", course: "Data Science", progress: 92, grade: "A+", status: "Completed", joined: "Dec 2025" },
  { id: 4, name: "Nisha Kapoor", email: "nisha@student.com", org: "Future Skills Hub", course: "Cloud Computing", progress: 12, grade: "-", status: "Enrolled", joined: "Feb 2026" },
  { id: 5, name: "Siddharth Ray", email: "siddharth@student.com", org: "CodeMasters Pro", course: "Mobile Dev", progress: 64, grade: "B", status: "Enrolled", joined: "Jan 2026" },
  { id: 6, name: "Ayesha Khan", email: "ayesha@student.com", org: "AI Nexus Labs", course: "NLP & AI", progress: 88, grade: "A", status: "Enrolled", joined: "Dec 2025" },
  { id: 7, name: "Dev Patel", email: "dev@student.com", org: "Innovate Labs", course: "Machine Learning", progress: 33, grade: "C+", status: "Enrolled", joined: "Feb 2026" },
  { id: 8, name: "Manisha Rao", email: "manisha@student.com", org: "DataDrive Academy", course: "Cybersecurity", progress: 0, grade: "-", status: "Dropped", joined: "Nov 2025" },
  { id: 9, name: "Karan Singh", email: "karan@student.com", org: "Quantum Learn", course: "UI/UX Design", progress: 55, grade: "B+", status: "Enrolled", joined: "Jan 2026" },
  { id: 10, name: "Pooja Iyer", email: "pooja@student.com", org: "TechVenture Inc.", course: "Web Development", progress: 71, grade: "A-", status: "Enrolled", joined: "Dec 2025" },
];

const statusStyles = {
  Enrolled: { bg: "rgba(99,102,241,0.1)", text: "#6366f1" },
  Completed: { bg: "rgba(16,185,129,0.1)", text: "#10b981" },
  Dropped: { bg: "rgba(239,68,68,0.1)", text: "#ef4444" },
};

const progressColor = (p) => {
  if (p >= 75) return "#10b981";
  if (p >= 40) return "#6366f1";
  return "#f59e0b";
};

export default function StudentDashboardControl() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", org: "Innovate Labs", course: "Machine Learning" });

  const orgs = [...new Set(initialStudents.map((s) => s.org))];
  const courses = [...new Set(initialStudents.map((s) => s.course))];

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.course.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setStudents((prev) => [...prev, { id: Date.now(), ...form, progress: 0, grade: "-", status: "Enrolled", joined: "Feb 2026" }]);
    setForm({ name: "", email: "", org: "Innovate Labs", course: "Machine Learning" });
    setAddModal(false);
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "Total Students", value: students.length, color: "#6366f1", icon: "🎓" },
          { label: "Enrolled", value: students.filter((s) => s.status === "Enrolled").length, color: "#10b981", icon: "📚" },
          { label: "Completed", value: students.filter((s) => s.status === "Completed").length, color: "#8b5cf6", icon: "🏆" },
          { label: "Avg Progress", value: `${Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length)}%`, color: "#f59e0b", icon: "📈" },
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
            <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", color: "#374151", width: "180px", fontFamily: "'Inter', sans-serif" }} />
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["All", "Enrolled", "Completed", "Dropped"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{ border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: statusFilter === s ? "#6366f1" : "#f3f4f6", color: statusFilter === s ? "#fff" : "#6b7280", transition: "all 0.2s" }}>{s}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setAddModal(true)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 18px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "13.5px", fontWeight: 600, cursor: "pointer", boxShadow: "0 3px 12px rgba(99,102,241,0.35)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Enroll Student
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["#", "Student", "Organisation", "Course", "Progress", "Grade", "Status", "Action"].map((h, i) => (
                  <th key={i} style={{ padding: "13px 18px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", borderBottom: "1px solid #f0f1f3", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => {
                const ss = statusStyles[student.status];
                const pc = progressColor(student.progress);
                return (
                  <tr key={student.id} style={{ borderBottom: "1px solid #f5f6f7", transition: "background 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "14px 18px", fontSize: "13px", color: "#9ca3af", fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: `hsl(${student.id * 37 + 160}, 50%, 88%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: `hsl(${student.id * 37 + 160}, 50%, 38%)` }}>
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{student.name}</div>
                          <div style={{ fontSize: "12px", color: "#9ca3af" }}>{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280" }}>{student.org}</td>
                    <td style={{ padding: "14px 18px", fontSize: "13px", fontWeight: 600, color: "#374151" }}>{student.course}</td>
                    <td style={{ padding: "14px 18px", minWidth: "120px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, height: "7px", borderRadius: "4px", background: "#f0f1f3", overflow: "hidden" }}>
                          <div style={{ width: `${student.progress}%`, height: "100%", borderRadius: "4px", background: pc, transition: "width 0.6s ease" }} />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: pc }}>{student.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: student.grade === "A+" ? "#10b981" : student.grade === "A" || student.grade === "A-" ? "#6366f1" : student.grade === "-" ? "#9ca3af" : "#6b7280" }}>{student.grade}</span>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px", background: ss.bg, color: ss.text, display: "flex", alignItems: "center", gap: "5px", width: "fit-content" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: ss.text }} />
                        {student.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <button onClick={() => setSelectedStudent(student)} style={{ padding: "6px 14px", borderRadius: "7px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "12.5px", fontWeight: 600, color: "#6366f1", cursor: "pointer", transition: "all 0.15s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "#eef2ff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fff"; }}
                      >View</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>No students match your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "18px", width: "480px", maxWidth: "95vw", boxShadow: "0 24px 48px rgba(0,0,0,0.15)", overflow: "hidden" }}>
            {/* Header gradient */}
            <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", padding: "28px", position: "relative" }}>
              <button onClick={() => setSelectedStudent(null)} style={{ position: "absolute", top: "16px", right: "16px", border: "none", background: "rgba(255,255,255,0.15)", borderRadius: "8px", width: "30px", height: "30px", cursor: "pointer", color: "#fff", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: "#fff" }}>
                  {selectedStudent.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>{selectedStudent.name}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>{selectedStudent.email}</div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                {[
                  { label: "Organisation", value: selectedStudent.org },
                  { label: "Course", value: selectedStudent.course },
                  { label: "Joined", value: selectedStudent.joined },
                  { label: "Grade", value: selectedStudent.grade },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#f7f8fa", borderRadius: "10px", padding: "14px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Progress Section */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Course Progress</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: progressColor(selectedStudent.progress) }}>{selectedStudent.progress}%</span>
                </div>
                <div style={{ height: "10px", borderRadius: "5px", background: "#f0f1f3", overflow: "hidden" }}>
                  <div style={{ width: `${selectedStudent.progress}%`, height: "100%", borderRadius: "5px", background: `linear-gradient(90deg, ${progressColor(selectedStudent.progress)}, ${progressColor(selectedStudent.progress)}88)`, transition: "width 0.8s ease" }} />
                </div>
              </div>

              {/* Status Badge + Actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid #f0f1f3" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "6px", background: statusStyles[selectedStudent.status].bg, color: statusStyles[selectedStudent.status].text }}>{selectedStudent.status}</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{ padding: "7px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Edit</button>
                  <button style={{ padding: "7px 16px", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {addModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: "18px", width: "440px", maxWidth: "95vw", padding: "28px", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>Enroll New Student</h3>
              <button onClick={() => setAddModal(false)} style={{ border: "none", background: "#f3f4f6", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#6b7280" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[{ label: "Full Name", key: "name", ph: "e.g. Arjun Mehta" }, { label: "Email", key: "email", ph: "e.g. arjun@student.com" }].map((f) => (
                <div key={f.key}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>{f.label}</label>
                  <input type="text" value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }} onFocus={(e) => (e.target.style.borderColor = "#6366f1")} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Organisation</label>
                  <select value={form.org} onChange={(e) => setForm((p) => ({ ...p, org: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#374151", outline: "none", background: "#fff", boxSizing: "border-box" }}>
                    {orgs.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "5px" }}>Course</label>
                  <select value={form.course} onChange={(e) => setForm((p) => ({ ...p, course: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#374151", outline: "none", background: "#fff", boxSizing: "border-box" }}>
                    {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button onClick={() => setAddModal(false)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleAdd} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Enroll Student</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}