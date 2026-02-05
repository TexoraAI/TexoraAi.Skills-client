import React, { useState } from "react";

const templates = [
  { id: 1, name: "Welcome New Organisation", subject: "Welcome to TexoraAi! 🎉", preview: "Congratulations on joining our platform...", category: "Onboarding", usedCount: 48 },
  { id: 2, name: "Password Reset", subject: "Your Password Reset Request", preview: "You have requested to reset your password...", category: "Security", usedCount: 124 },
  { id: 3, name: "Monthly Report Summary", subject: "Your Monthly Performance Report", preview: "Here is a summary of your organisation's performance...", category: "Reports", usedCount: 89 },
  { id: 4, name: "Course Completion", subject: "Congratulations! Course Completed 🏆", preview: "You have successfully completed the course...", category: "Onboarding", usedCount: 67 },
  { id: 5, name: "Subscription Renewal", subject: "Your Subscription Renews Soon", preview: "Your subscription plan is set to renew on...", category: "Business", usedCount: 34 },
  { id: 6, name: "System Maintenance", subject: "Scheduled Maintenance Notification", preview: "We will be performing scheduled maintenance on...", category: "System", usedCount: 12 },
];

const sentHistory = [
  { id: 1, subject: "Welcome to TexoraAi! 🎉", to: "Innovate Labs Team", type: "Single", sentAt: "Feb 03, 2026 10:30", status: "Delivered", opens: 12, clicks: 4 },
  { id: 2, subject: "Monthly Performance Report", to: "All Organisations (8)", type: "Campaign", sentAt: "Feb 01, 2026 09:00", status: "Delivered", opens: 45, clicks: 18 },
  { id: 3, subject: "Subscription Renews Soon", to: "Future Skills Hub", type: "Single", sentAt: "Jan 30, 2026 14:15", status: "Delivered", opens: 3, clicks: 1 },
  { id: 4, subject: "System Maintenance Alert", to: "All Users (364)", type: "Campaign", sentAt: "Jan 28, 2026 08:00", status: "Delivered", opens: 198, clicks: 0 },
  { id: 5, subject: "Password Reset Request", to: "Arjun Mehta", type: "Single", sentAt: "Jan 27, 2026 16:45", status: "Failed", opens: 0, clicks: 0 },
  { id: 6, subject: "Course Completion Notice", to: "Rahul Verma", type: "Single", sentAt: "Jan 25, 2026 11:20", status: "Delivered", opens: 1, clicks: 1 },
];

const recipientOptions = [
  { label: "All Organisations", value: "all-orgs", count: 8 },
  { label: "All Admins", value: "all-admins", count: 364 },
  { label: "All Trainers", value: "all-trainers", count: 892 },
  { label: "All Students", value: "all-students", count: 12458 },
  { label: "Innovate Labs", value: "org-1", count: 48 },
  { label: "TechVenture Inc.", value: "org-2", count: 36 },
  { label: "EduZone Academy", value: "org-3", count: 52 },
  { label: "Active Subscribers Only", value: "active-subs", count: 312 },
];

export default function SendEmail() {
  const [activeTab, setActiveTab] = useState("compose"); // compose | campaign | templates | history
  const [composeData, setComposeData] = useState({ to: "", subject: "", body: "", schedule: false, scheduleTime: "" });
  const [campaignData, setCampaignData] = useState({ recipients: [], subject: "", body: "", schedule: false, scheduleTime: "" });
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [sentSuccess, setSentSuccess] = useState(false);

  const tabs = [
    { id: "compose", label: "Compose", icon: "✉️" },
    { id: "campaign", label: "Campaign", icon: "📣" },
    { id: "templates", label: "Templates", icon: "📄" },
    { id: "history", label: "Sent History", icon: "📥" },
  ];

  const toggleRecipient = (val) => {
    setSelectedRecipients((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  };

  const handleSend = () => {
    setSentSuccess(true);
    setComposeData({ to: "", subject: "", body: "", schedule: false, scheduleTime: "" });
    setTimeout(() => setSentSuccess(false), 3000);
  };

  const handleCampaignSend = () => {
    setSentSuccess(true);
    setSelectedRecipients([]);
    setCampaignData({ recipients: [], subject: "", body: "", schedule: false, scheduleTime: "" });
    setTimeout(() => setSentSuccess(false), 3000);
  };

  const statusStyle = (s) => {
    if (s === "Delivered") return { bg: "rgba(16,185,129,0.1)", text: "#10b981" };
    if (s === "Pending") return { bg: "rgba(245,158,11,0.1)", text: "#d97706" };
    return { bg: "rgba(239,68,68,0.1)", text: "#ef4444" };
  };

  const catColor = (c) => {
    const map = { Onboarding: "#6366f1", Security: "#ef4444", Reports: "#f59e0b", Business: "#10b981", System: "#8b5cf6" };
    return map[c] || "#9ca3af";
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Success Toast */}
      {sentSuccess && (
        <div style={{ marginBottom: "16px", padding: "14px 18px", borderRadius: "12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#10b981" }}>Email sent successfully! 🎉</span>
        </div>
      )}

      {/* Tab Bar */}
      <div style={{ background: "#fff", borderRadius: "14px", padding: "8px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", gap: "6px", marginBottom: "20px" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              background: activeTab === tab.id ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
              color: activeTab === tab.id ? "#fff" : "#6b7280",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
              boxShadow: activeTab === tab.id ? "0 3px 10px rgba(99,102,241,0.3)" : "none",
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ========== COMPOSE TAB ========== */}
      {activeTab === "compose" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
          {/* Compose Form */}
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f1f3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>New Email</h3>
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>Single recipient email</span>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* To Field */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>To</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input type="text" placeholder="Email or name..." value={composeData.to} onChange={(e) => setComposeData((p) => ({ ...p, to: e.target.value }))} style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", fontFamily: "'Inter', sans-serif" }} onFocus={(e) => (e.target.style.borderColor = "#6366f1")} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
                  <select style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "13px", color: "#374151", outline: "none", background: "#f7f8fa", fontFamily: "'Inter', sans-serif" }}>
                    <option>Quick Select</option>
                    <option>All Admins</option>
                    <option>All Trainers</option>
                    <option>All Students</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Subject</label>
                <input type="text" placeholder="Enter email subject..." value={composeData.subject} onChange={(e) => setComposeData((p) => ({ ...p, subject: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }} onFocus={(e) => (e.target.style.borderColor = "#6366f1")} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
              </div>

              {/* Body */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Message Body</label>
                <textarea placeholder="Write your email message here..." value={composeData.body} onChange={(e) => setComposeData((p) => ({ ...p, body: e.target.value }))} rows={7} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#6366f1")} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
              </div>

              {/* Schedule Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "#f7f8fa", borderRadius: "10px", border: "1px solid #eef0f2" }}>
                <div
                  onClick={() => setComposeData((p) => ({ ...p, schedule: !p.schedule }))}
                  style={{
                    width: "44px", height: "24px", borderRadius: "12px",
                    background: composeData.schedule ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e5e7eb",
                    position: "relative", cursor: "pointer", transition: "background 0.3s",
                  }}
                >
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: composeData.schedule ? "23px" : "3px", transition: "left 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Schedule Send</div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Set a specific date & time</div>
                </div>
              </div>

              {composeData.schedule && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af", display: "block", marginBottom: "5px" }}>Date</label>
                    <input type="date" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#374151", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af", display: "block", marginBottom: "5px" }}>Time</label>
                    <input type="time" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#374151", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
              )}

              {/* Send Buttons */}
              <div style={{ display: "flex", gap: "10px", paddingTop: "8px" }}>
                <button style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Save Draft</button>
                <button onClick={handleSend} style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 3px 12px rgba(99,102,241,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  {composeData.schedule ? "Schedule Email" : "Send Now"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Tips + Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", padding: "20px" }}>
              <h4 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 700, color: "#111827" }}>📊 Email Stats</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[{ label: "Emails Sent Today", value: "3" }, { label: "Avg Open Rate", value: "68%" }, { label: "Avg Click Rate", value: "22%" }].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", color: "#6b7280" }}>{s.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", padding: "20px" }}>
              <h4 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 700, color: "#111827" }}>💡 Best Practices</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Keep subject under 60 characters", "Personalise with recipient name", "Include a clear call-to-action", "Test before sending to large groups"].map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "5px", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span style={{ fontSize: "13px", color: "#6b7280" }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== CAMPAIGN TAB ========== */}
      {activeTab === "campaign" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f1f3", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📣</div>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>Email Campaign</h3>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#9ca3af" }}>Send bulk emails to multiple recipients at once</p>
              </div>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Subject */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Campaign Subject</label>
                <input type="text" placeholder="e.g. Monthly Newsletter - Feb 2026" value={campaignData.subject} onChange={(e) => setCampaignData((p) => ({ ...p, subject: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }} onFocus={(e) => (e.target.style.borderColor = "#6366f1")} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
              </div>

              {/* Body */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Campaign Message</label>
                <textarea placeholder="Write your campaign message..." value={campaignData.body} onChange={(e) => setCampaignData((p) => ({ ...p, body: e.target.value }))} rows={6} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#111827", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }} onFocus={(e) => (e.target.style.borderColor = "#6366f1")} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
              </div>

              {/* Schedule Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "#f7f8fa", borderRadius: "10px", border: "1px solid #eef0f2" }}>
                <div onClick={() => setCampaignData((p) => ({ ...p, schedule: !p.schedule }))} style={{ width: "44px", height: "24px", borderRadius: "12px", background: campaignData.schedule ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#e5e7eb", position: "relative", cursor: "pointer", transition: "background 0.3s" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: campaignData.schedule ? "23px" : "3px", transition: "left 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Schedule Campaign</div>
                  <div style={{ fontSize: "12px", color: "#9ca3af" }}>Emails will be sent at the specified time</div>
                </div>
              </div>

              {campaignData.schedule && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af", display: "block", marginBottom: "5px" }}>Date</label>
                    <input type="date" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#374151", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af", display: "block", marginBottom: "5px" }}>Time</label>
                    <input type="time" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", color: "#374151", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
              )}

              {/* Total count preview */}
              <div style={{ padding: "12px 16px", borderRadius: "10px", background: selectedRecipients.length > 0 ? "rgba(99,102,241,0.06)" : "#f7f8fa", border: `1px solid ${selectedRecipients.length > 0 ? "rgba(99,102,241,0.2)" : "#eef0f2"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                  Total Recipients: <span style={{ color: "#6366f1" }}>{recipientOptions.filter((r) => selectedRecipients.includes(r.value)).reduce((a, r) => a + r.count, 0).toLocaleString()}</span>
                </span>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>{selectedRecipients.length} group(s) selected</span>
              </div>

              {/* Send */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "14px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Save Draft</button>
                <button onClick={handleCampaignSend} style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #ec4899, #db2777)", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 3px 12px rgba(236,72,153,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                  {campaignData.schedule ? "Schedule Campaign" : "Launch Campaign"}
                </button>
              </div>
            </div>
          </div>

          {/* Recipient Selector Panel */}
          <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f1f3" }}>
              <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#111827" }}>👥 Select Recipients</h4>
              <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#9ca3af" }}>Choose one or more groups</p>
            </div>
            <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {recipientOptions.map((r) => {
                const isSelected = selectedRecipients.includes(r.value);
                return (
                  <button
                    key={r.value}
                    onClick={() => toggleRecipient(r.value)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "11px 14px", borderRadius: "10px", border: isSelected ? "2px solid #6366f1" : "1px solid #eef0f2",
                      background: isSelected ? "rgba(99,102,241,0.06)" : "#fff",
                      cursor: "pointer", transition: "all 0.2s", width: "100%", textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "6px", border: isSelected ? "none" : "2px solid #e0e2e6", background: isSelected ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      </div>
                      <span style={{ fontSize: "13.5px", fontWeight: 600, color: isSelected ? "#6366f1" : "#374151" }}>{r.label}</span>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", background: "#f3f4f6", padding: "2px 8px", borderRadius: "10px" }}>{r.count.toLocaleString()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========== TEMPLATES TAB ========== */}
      {activeTab === "templates" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {["All", "Onboarding", "Security", "Reports", "Business", "System"].map((cat) => (
                <button key={cat} style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: cat === "All" ? "#6366f1" : "#f3f4f6", color: cat === "All" ? "#fff" : "#6b7280", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>{cat}</button>
              ))}
            </div>
            <button style={{ padding: "8px 18px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: "13.5px", fontWeight: 600, cursor: "pointer", boxShadow: "0 3px 10px rgba(99,102,241,0.3)" }}>+ New Template</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
            {templates.map((t) => (
              <div key={t.id} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
              >
                {/* Color bar top */}
                <div style={{ height: "4px", background: catColor(t.category) }} />
                <div style={{ padding: "18px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "5px", background: `${catColor(t.category)}15`, color: catColor(t.category) }}>{t.category}</span>
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>Used {t.usedCount}x</span>
                  </div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700, color: "#111827" }}>{t.name}</h4>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#6366f1", fontWeight: 600 }}>{t.subject}</p>
                  <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#9ca3af", lineHeight: 1.4 }}>{t.preview}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ flex: 1, padding: "7px", borderRadius: "8px", border: "1px solid #6366f1", background: "transparent", color: "#6366f1", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }} onClick={() => { setActiveTab("compose"); }}>Use Template</button>
                    <button style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}>Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== HISTORY TAB ========== */}
      {activeTab === "history" && (
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eef0f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f1f3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>Sent Email History</h3>
              <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#9ca3af" }}>Track all sent emails and their performance</p>
            </div>
            <button style={{ padding: "7px 16px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "12.5px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Export</button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                {["Subject", "Sent To", "Type", "Sent At", "Opens", "Clicks", "Status"].map((h, i) => (
                  <th key={i} style={{ padding: "13px 18px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", borderBottom: "1px solid #f0f1f3", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sentHistory.map((email) => {
                const ss = statusStyle(email.status);
                return (
                  <tr key={email.id} style={{ borderBottom: "1px solid #f5f6f7" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fafbfc")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{email.subject}</div>
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280" }}>{email.to}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ fontSize: "11.5px", fontWeight: 600, padding: "3px 9px", borderRadius: "5px", background: email.type === "Campaign" ? "rgba(236,72,153,0.1)" : "rgba(99,102,241,0.1)", color: email.type === "Campaign" ? "#ec4899" : "#6366f1" }}>{email.type}</span>
                    </td>
                    <td style={{ padding: "14px 18px", fontSize: "13px", color: "#6b7280", whiteSpace: "nowrap" }}>{email.sentAt}</td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{email.opens}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>{email.clicks}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px", background: ss.bg, color: ss.text, display: "flex", alignItems: "center", gap: "5px", width: "fit-content" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: ss.text }} />
                        {email.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}