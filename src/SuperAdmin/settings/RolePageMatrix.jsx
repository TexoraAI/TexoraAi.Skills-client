import React, { useState } from "react";

const roles = ["Super Admin", "Admin", "Trainer", "Student"];

const pages = [
  { category: "Core", items: ["Dashboard", "Profile", "Notifications"] },
  { category: "Management", items: ["Organisation Control", "Admin Control", "Trainer Control", "Student Control"] },
  { category: "Business", items: ["Business Dashboard", "Revenue Reports", "Invoices", "Subscription Plans"] },
  { category: "Settings", items: ["Role Page Matrix", "Audit Logs", "Send Email", "System Settings", "API Keys"] },
  { category: "Reports", items: ["Analytics", "Export Reports", "Custom Reports"] },
];

// Generate initial permission matrix: Super Admin has all, others have partial
const generateInitial = () => {
  const matrix = {};
  pages.forEach((cat) => {
    cat.items.forEach((page) => {
      matrix[page] = {
        "Super Admin": true,
        Admin: !["Role Page Matrix", "System Settings", "API Keys", "Revenue Reports", "Invoices", "Subscription Plans"].includes(page),
        Trainer: ["Dashboard", "Profile", "Notifications", "Student Control", "Analytics"].includes(page),
        Student: ["Dashboard", "Profile", "Notifications"].includes(page),
      };
    });
  });
  return matrix;
};

export default function RolePageMatrix() {
  const [matrix, setMatrix] = useState(generateInitial);
  const [saved, setSaved] = useState(false);
  const [expandedCats, setExpandedCats] = useState(["Core", "Management", "Business", "Settings", "Reports"]);

  const toggle = (page, role) => {
    if (role === "Super Admin") return; // Cannot change super admin
    setMatrix((prev) => ({ ...prev, [page]: { ...prev[page], [role]: !prev[page][role] } }));
    setSaved(false);
  };

  const toggleCategory = (cat) => {
    setExpandedCats((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const countAccess = (role) => {
    let count = 0;
    Object.values(matrix).forEach((perms) => { if (perms[role]) count++; });
    return count;
  };

  const totalPages = Object.keys(matrix).length;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Role Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {roles.map((role, i) => {
          const colors = ["#6366f1", "#10b981", "#f59e0b", "#ec4899"];
          const icons = ["👑", "🏢", "📖", "🎓"];
          const count = countAccess(role);
          const pct = Math.round((count / totalPages) * 100);
          return (
            <div key={role} style={{ background: "#fff", borderRadius: "14px", padding: "18px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${colors[i]}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{icons[i]}</div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>{role}</div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>{count}/{totalPages} pages</div>
                </div>
              </div>
              <div style={{ height: "5px", borderRadius: "3px", background: "#f0f1f3", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: "3px", background: colors[i], transition: "width 0.5s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Matrix Card */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f1f3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>Role & Page Permission Matrix</h3>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#9ca3af" }}>Configure which roles can access which pages. Super Admin access cannot be modified.</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setMatrix(generateInitial())} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Reset</button>
            <button onClick={handleSave} style={{ padding: "8px 20px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", boxShadow: "0 3px 10px rgba(99,102,241,0.3)" }}>Save Changes</button>
          </div>
        </div>

        {/* Success Toast */}
        {saved && (
          <div style={{ margin: "16px 24px 0", padding: "12px 16px", borderRadius: "10px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#10b981" }}>Permission matrix saved successfully!</span>
          </div>
        )}

        {/* Column Headers */}
        <div style={{ display: "grid", gridTemplateColumns: "280px repeat(4, 1fr)", borderBottom: "2px solid #f0f1f3", padding: "0 24px", marginTop: "12px" }}>
          <div style={{ padding: "10px 0", fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px" }}>Page</div>
          {roles.map((role, i) => {
            const colors = ["#6366f1", "#10b981", "#f59e0b", "#ec4899"];
            return (
              <div key={role} style={{ padding: "10px 0", textAlign: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: colors[i], padding: "4px 12px", borderRadius: "6px", background: `${colors[i]}12` }}>{role}</span>
              </div>
            );
          })}
        </div>

        {/* Category Groups */}
        {pages.map((cat) => {
          const isExpanded = expandedCats.includes(cat.category);
          const catColors = { Core: "#6366f1", Management: "#10b981", Business: "#f59e0b", Settings: "#ec4899", Reports: "#8b5cf6" };
          return (
            <div key={cat.category} style={{ borderBottom: "1px solid #f0f1f3" }}>
              {/* Category Header */}
              <button onClick={() => toggleCategory(cat.category)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "11px 24px", background: "#fafafa", border: "none", cursor: "pointer", textAlign: "left" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span style={{ fontSize: "12px", fontWeight: 700, color: catColors[cat.category], textTransform: "uppercase", letterSpacing: "0.8px" }}>{cat.category}</span>
                <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "auto" }}>{cat.items.length} pages</span>
              </button>

              {/* Rows */}
              {isExpanded &&
                cat.items.map((page, rowI) => (
                  <div key={page} style={{ display: "grid", gridTemplateColumns: "280px repeat(4, 1fr)", padding: "0 24px", borderTop: "1px solid #f5f6f7", background: rowI % 2 === 0 ? "#fff" : "#fafbfc" }}>
                    <div style={{ padding: "12px 0", fontSize: "13.5px", fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: catColors[cat.category] }} />
                      {page}
                    </div>
                    {roles.map((role) => {
                      const checked = matrix[page]?.[role];
                      const locked = role === "Super Admin";
                      return (
                        <div key={role} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div
                            onClick={() => !locked && toggle(page, role)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "6px",
                              border: checked ? "none" : "2px solid #e0e2e6",
                              background: checked ? (locked ? "#c7d2fe" : "linear-gradient(135deg, #6366f1, #8b5cf6)") : "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: locked ? "not-allowed" : "pointer",
                              transition: "all 0.2s",
                              boxShadow: checked ? "0 2px 6px rgba(99,102,241,0.3)" : "none",
                              opacity: locked ? 0.6 : 1,
                            }}
                          >
                            {checked && (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: "16px", padding: "14px 20px", background: "#fff", borderRadius: "12px", border: "1px solid #eef0f2", display: "flex", alignItems: "center", gap: "24px" }}>
        <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600 }}>LEGEND:</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <span style={{ fontSize: "12px", color: "#374151" }}>Access Granted</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "5px", border: "2px solid #e0e2e6", background: "#fff" }} />
          <span style={{ fontSize: "12px", color: "#374151" }}>No Access</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: "#c7d2fe", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <span style={{ fontSize: "12px", color: "#374151" }}>Locked (Super Admin)</span>
        </div>
      </div>
    </div>
  );
}