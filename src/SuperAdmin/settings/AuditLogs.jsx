import React, { useState } from "react";

const auditData = [
  { id: 1, user: "Super Admin", action: "Organisation Created", target: "Innovate Labs", ip: "192.168.1.45", time: "Feb 03, 2026 13:42", type: "CREATE", status: "Success" },
  { id: 2, user: "Admin - Rajesh", action: "User Role Updated", target: "Priya Sharma → Trainer", ip: "10.0.0.12", time: "Feb 03, 2026 13:30", type: "UPDATE", status: "Success" },
  { id: 3, user: "Super Admin", action: "Email Campaign Sent", target: "All Organisations", ip: "192.168.1.45", time: "Feb 03, 2026 12:58", type: "ACTION", status: "Success" },
  { id: 4, user: "Admin - Kavita", action: "Student Enrolled", target: "Arjun Mehta → ML Course", ip: "172.16.0.8", time: "Feb 03, 2026 12:15", type: "CREATE", status: "Success" },
  { id: 5, user: "System", action: "Login Attempt Failed", target: "Unknown User", ip: "45.33.32.156", time: "Feb 03, 2026 11:47", type: "SECURITY", status: "Failed" },
  { id: 6, user: "Super Admin", action: "Permission Matrix Updated", target: "Trainer Role", ip: "192.168.1.45", time: "Feb 03, 2026 11:20", type: "UPDATE", status: "Success" },
  { id: 7, user: "Admin - Deepa", action: "Organisation Suspended", target: "DataDrive Academy", ip: "10.0.0.34", time: "Feb 03, 2026 10:55", type: "UPDATE", status: "Success" },
  { id: 8, user: "System", action: "Backup Completed", target: "Full System Backup", ip: "Internal", time: "Feb 03, 2026 03:00", type: "SYSTEM", status: "Success" },
  { id: 9, user: "Admin - Vikram", action: "Trainer Removed", target: "Sameer Khan", ip: "10.0.0.22", time: "Feb 02, 2026 16:40", type: "DELETE", status: "Success" },
  { id: 10, user: "Super Admin", action: "API Key Regenerated", target: "Production Key", ip: "192.168.1.45", time: "Feb 02, 2026 15:10", type: "SECURITY", status: "Success" },
  { id: 11, user: "System", action: "Subscription Expired", target: "Quantum Learn - Basic", ip: "Internal", time: "Feb 02, 2026 00:00", type: "SYSTEM", status: "Warning" },
  { id: 12, user: "Admin - Anil", action: "Course Content Updated", target: "Data Science Module 3", ip: "172.16.0.15", time: "Feb 01, 2026 14:25", type: "UPDATE", status: "Success" },
];

const typeStyles = {
  CREATE: { bg: "rgba(16,185,129,0.1)", text: "#10b981" },
  UPDATE: { bg: "rgba(99,102,241,0.1)", text: "#6366f1" },
  DELETE: { bg: "rgba(239,68,68,0.1)", text: "#ef4444" },
  ACTION: { bg: "rgba(245,158,11,0.1)", text: "#d97706" },
  SECURITY: { bg: "rgba(236,72,153,0.1)", text: "#ec4899" },
  SYSTEM: { bg: "rgba(139,92,246,0.1)", text: "#7c3aed" },
};

const statusStyles = {
  Success: { bg: "rgba(16,185,129,0.08)", text: "#10b981", dot: "#10b981" },
  Failed: { bg: "rgba(239,68,68,0.08)", text: "#ef4444", dot: "#ef4444" },
  Warning: { bg: "rgba(245,158,11,0.08)", text: "#d97706", dot: "#d97706" },
};

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState(null);

  const types = ["All", "CREATE", "UPDATE", "DELETE", "ACTION", "SECURITY", "SYSTEM"];
  const statuses = ["All", "Success", "Failed", "Warning"];

  const filtered = auditData.filter((log) => {
    const matchSearch = log.action.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase()) || log.target.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || log.type === typeFilter;
    const matchStatus = statusFilter === "All" || log.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const summary = [
    { label: "Total Events", value: auditData.length, color: "#6366f1", icon: "📋" },
    { label: "Today's Events", value: auditData.filter((l) => l.time.startsWith("Feb 03")).length, color: "#10b981", icon: "📅" },
    { label: "Security Alerts", value: auditData.filter((l) => l.type === "SECURITY").length, color: "#ec4899", icon: "🔒" },
    { label: "Failed Actions", value: auditData.filter((l) => l.status === "Failed").length, color: "#ef4444", icon: "⚠️" },
  ];

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
        {summary.map((s, i) => (
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
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f7f8fa", borderRadius: "10px", padding: "8px 14px", border: "1px solid #eef0f2" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", color: "#374151", width: "180px", fontFamily: "'Inter', sans-serif" }} />
          </div>

          {/* Type Filter */}
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid #eef0f2", fontSize: "13px", color: "#374151", outline: "none", background: "#f7f8fa", fontFamily: "'Inter', sans-serif", cursor: "pointer" }}>
            {types.map((t) => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
          </select>

          {/* Status Filter */}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "8px 14px", borderRadius: "10px", border: "1px solid #eef0f2", fontSize: "13px", color: "#374151", outline: "none", background: "#f7f8fa", fontFamily: "'Inter', sans-serif", cursor: "pointer" }}>
            {statuses.map((s) => <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>)}
          </select>
        </div>

        <button style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Export
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["", "Type", "Action", "Target", "User", "IP Address", "Time", "Status"].map((h, i) => (
                  <th key={i} style={{ padding: "13px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", borderBottom: "1px solid #f0f1f3", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const ts = typeStyles[log.type];
                const ss = statusStyles[log.status];
                const isExpanded = expandedRow === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr
                      style={{ borderBottom: "1px solid #f5f6f7", transition: "background 0.15s", cursor: "pointer" }}
                      onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = isExpanded ? "#f0f4ff" : "transparent")}
                    >
                      {/* Expand Arrow */}
                      <td style={{ padding: "14px 10px 14px 16px", width: "32px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "5px", background: ts.bg, color: ts.text }}>{log.type}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 600, color: "#111827" }}>{log.action}</td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280" }}>{log.target}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: log.user === "System" ? "#f3f4f6" : "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: log.user === "System" ? "#6b7280" : "#6366f1" }}>
                            {log.user === "System" ? "SY" : log.user.split(" ").pop()[0]}
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>{log.user}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#9ca3af", fontFamily: "monospace" }}>{log.ip}</td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6b7280", whiteSpace: "nowrap" }}>{log.time}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "11.5px", fontWeight: 600, padding: "3px 10px", borderRadius: "5px", background: ss.bg, color: ss.text, display: "flex", alignItems: "center", gap: "5px", width: "fit-content" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: ss.dot }} />
                          {log.status}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr style={{ background: "#f0f4ff" }}>
                        <td colSpan={8} style={{ padding: "0 16px" }}>
                          <div style={{ padding: "16px 0", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
                            {[
                              { label: "Event ID", value: `EVT-${String(log.id).padStart(6, "0")}` },
                              { label: "Session Token", value: "sess_" + Math.random().toString(36).slice(2, 14) },
                              { label: "Browser", value: "Chrome 121.0 / Windows 11" },
                              { label: "Location", value: "Bangalore, Karnataka, IN" },
                            ].map((item, i) => (
                              <div key={i} style={{ background: "#fff", borderRadius: "8px", padding: "12px 14px", border: "1px solid #e0e7ff" }}>
                                <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "4px" }}>{item.label}</div>
                                <div style={{ fontSize: "13px", fontWeight: 500, color: "#374151", fontFamily: item.label === "Session Token" || item.label === "Event ID" ? "monospace" : "'Inter', sans-serif" }}>{item.value}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>No audit logs match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #f0f1f3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", color: "#9ca3af" }}>Showing {filtered.length} of {auditData.length} logs</span>
          <div style={{ display: "flex", gap: "6px" }}>
            {["←", "1", "2", "3", "→"].map((p, i) => (
              <button key={i} style={{ width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #e5e7eb", background: p === "1" ? "#6366f1" : "#fff", color: p === "1" ? "#fff" : "#374151", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}