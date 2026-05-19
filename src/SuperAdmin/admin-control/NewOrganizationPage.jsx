// pages/NewOrganizationPage.jsx
// SuperAdmin → Create a new organization
// Route: /superadmin/organizations/new

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSaas } from "../context/SaasContext";
import { useTheme } from "../context/ThemeContext";
import BreadcrumbNavigation from "../components/layout/navigation/BreadcrumbNavigation";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const PLANS = ["free", "starter", "pro", "enterprise"];
const STATUSES = ["active", "inactive", "trial"];

const INDUSTRIES = [
  "Education",
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Media",
  "Government",
  "Non-Profit",
  "Other",
];

const PLAN_CONFIG = {
  free:       { label: "Free",       dot: "#94a3b8", bg: "rgba(148,163,184,0.12)", color: "#64748b" },
  starter:    { label: "Starter",    dot: "#14b8a6", bg: "rgba(20,184,166,0.12)",  color: "#0d9488" },
  pro:        { label: "Pro",        dot: "#8b5cf6", bg: "rgba(139,92,246,0.12)",  color: "#7c3aed" },
  enterprise: { label: "Enterprise", dot: "#f59e0b", bg: "rgba(245,158,11,0.12)",  color: "#d97706" },
};

const STATUS_CONFIG = {
  active:   { label: "Active",   dot: "#10b981", bg: "rgba(16,185,129,0.12)",  color: "#059669" },
  inactive: { label: "Inactive", dot: "#ef4444", bg: "rgba(239,68,68,0.12)",   color: "#dc2626" },
  trial:    { label: "Trial",    dot: "#f59e0b", bg: "rgba(245,158,11,0.12)",   color: "#d97706" },
};

// ─────────────────────────────────────────────
// INITIAL FORM STATE
// ─────────────────────────────────────────────
const INITIAL_FORM = {
  name:         "",
  domain:       "",
  industry:     "",
  location:     "",
  contactEmail: "",
  plan:         "starter",
  status:       "active",
  maxStudents:  100,
  maxTrainers:  10,
  planExpiry:   "",
  description:  "",
};

// ─────────────────────────────────────────────
// FIELD COMPONENT
// ─────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: error ? "#ef4444" : undefined }}>
      {label}
      {required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </label>
    {children}
    {error && (
      <span style={{ fontSize: 11, color: "#ef4444" }}>{error}</span>
    )}
  </div>
);

// ─────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────
const SectionHeader = ({ icon, title, txtMain }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
    <span style={{ fontSize: 16 }}>{icon}</span>
    <div style={{ fontSize: 13, fontWeight: 700, color: txtMain }}>{title}</div>
  </div>
);

// ─────────────────────────────────────────────
// BADGE PREVIEW
// ─────────────────────────────────────────────
const BadgePreview = ({ cfg }) => {
  if (!cfg) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 600, padding: "3px 9px",
      borderRadius: 999, background: cfg.bg, color: cfg.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

// ─────────────────────────────────────────────
// AVATAR PREVIEW
// ─────────────────────────────────────────────
const AVATAR_COLORS = [
  ["#6366f1","#818cf8"],["#8b5cf6","#a78bfa"],["#ec4899","#f472b6"],
  ["#14b8a6","#2dd4bf"],["#f59e0b","#fbbf24"],["#10b981","#34d399"],
  ["#3b82f6","#60a5fa"],["#ef4444","#f87171"],
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];

function initials(name = "") {
  return name.split(" ").map((w) => w[0] || "").join("").slice(0, 2).toUpperCase() || "?";
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const NewOrganizationPage = () => {
  const navigate  = useNavigate();
  const { dark }  = useTheme();
  const { createOrganization, addOrganization } = useSaas();

  const [form,    setForm]    = useState(INITIAL_FORM);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Design tokens (same as rest of codebase) ──
  const cardBg  = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const cardBdr = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub  = dark ? "#64748b" : "#94a3b8";
  const inputBg = dark ? "rgba(255,255,255,0.05)" : "#f8fafc";
  const inputBdr = dark ? "rgba(255,255,255,0.10)" : "#e5e7eb";
  const inputFocus = "#6366f1";
  const divClr  = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  // ── Input style helper ──
  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: `1px solid ${hasError ? "#ef4444" : inputBdr}`,
    background: inputBg,
    color: txtMain,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  });

  const selectStyle = (hasError) => ({
    ...inputStyle(hasError),
    cursor: "pointer",
  });

  // ── Handlers ──
  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name         = "Organization name is required";
    if (!form.domain.trim())       e.domain       = "Domain is required";
    if (!form.contactEmail.trim()) e.contactEmail = "Contact email is required";
    else if (!/\S+@\S+\.\S+/.test(form.contactEmail))
      e.contactEmail = "Enter a valid email address";
    if (!form.industry)            e.industry     = "Please select an industry";
    if (form.maxStudents < 1)      e.maxStudents  = "Must be at least 1";
    if (form.maxTrainers < 1)      e.maxTrainers  = "Must be at least 1";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      const newOrg = {
        ...form,
        maxStudents: Number(form.maxStudents),
        maxTrainers: Number(form.maxTrainers),
        createdAt:   new Date().toISOString(),
        id:          `org_${Date.now()}`,
      };

      // Support both common function names in SaasContext
      if (typeof createOrganization === "function") {
        await createOrganization(newOrg);
      } else if (typeof addOrganization === "function") {
        await addOrganization(newOrg);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/superadmin/organizations");
      }, 1200);
    } catch (err) {
      console.error("Failed to create organization:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Avatar preview colors ──
  const [avatarA, avatarB] = avatarColor(form.name);

  // ── Success state ──
  if (success) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 40px", gap: 16 }}>
        <div style={{ fontSize: 56 }}>🎉</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: txtMain }}>Organization Created!</div>
        <div style={{ fontSize: 13, color: txtSub }}>Redirecting to organizations list…</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Breadcrumb */}
      <BreadcrumbNavigation
        items={[
          { label: "Organizations", href: "/superadmin/organizations" },
          { label: "New Organization" },
        ]}
      />

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: txtMain, margin: 0, letterSpacing: "-0.02em" }}>
            New Organization
          </h1>
          <p style={{ fontSize: 13, color: txtSub, margin: "4px 0 0" }}>
            Fill in the details to onboard a new organization
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/superadmin/organizations")}
            style={{
              padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: dark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
              color: txtSub, border: "none", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "9px 22px", borderRadius: 8, fontSize: 13, fontWeight: 700,
              background: loading ? "#818cf8" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 8,
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? (
              <>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                  style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Creating…
              </>
            ) : (
              <>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create Organization
              </>
            )}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

        {/* ── LEFT: Form ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Basic Info */}
          <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 14, padding: "22px 24px" }}>
            <SectionHeader icon="🏢" title="Basic Information" txtMain={txtMain} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Organization Name" required error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Texora AI"
                  style={inputStyle(errors.name)}
                  onFocus={(e) => { e.target.style.borderColor = inputFocus; }}
                  onBlur={(e)  => { e.target.style.borderColor = errors.name ? "#ef4444" : inputBdr; }}
                />
              </Field>

              <Field label="Domain" required error={errors.domain}>
                <input
                  value={form.domain}
                  onChange={(e) => set("domain", e.target.value)}
                  placeholder="e.g. texora.ai"
                  style={inputStyle(errors.domain)}
                  onFocus={(e) => { e.target.style.borderColor = inputFocus; }}
                  onBlur={(e)  => { e.target.style.borderColor = errors.domain ? "#ef4444" : inputBdr; }}
                />
              </Field>

              <Field label="Contact Email" required error={errors.contactEmail}>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                  placeholder="e.g. admin@texora.ai"
                  style={inputStyle(errors.contactEmail)}
                  onFocus={(e) => { e.target.style.borderColor = inputFocus; }}
                  onBlur={(e)  => { e.target.style.borderColor = errors.contactEmail ? "#ef4444" : inputBdr; }}
                />
              </Field>

              <Field label="Location">
                <input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. New Delhi, India"
                  style={inputStyle(false)}
                  onFocus={(e) => { e.target.style.borderColor = inputFocus; }}
                  onBlur={(e)  => { e.target.style.borderColor = inputBdr; }}
                />
              </Field>

              <Field label="Industry" required error={errors.industry}>
                <select
                  value={form.industry}
                  onChange={(e) => set("industry", e.target.value)}
                  style={selectStyle(errors.industry)}
                  onFocus={(e) => { e.target.style.borderColor = inputFocus; }}
                  onBlur={(e)  => { e.target.style.borderColor = errors.industry ? "#ef4444" : inputBdr; }}
                >
                  <option value="">Select industry…</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </Field>

              <Field label="Description">
                <input
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Brief description (optional)"
                  style={inputStyle(false)}
                  onFocus={(e) => { e.target.style.borderColor = inputFocus; }}
                  onBlur={(e)  => { e.target.style.borderColor = inputBdr; }}
                />
              </Field>
            </div>
          </div>

          {/* Plan & Status */}
          <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 14, padding: "22px 24px" }}>
            <SectionHeader icon="📋" title="Plan & Status" txtMain={txtMain} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

              {/* Plan selector — visual cards */}
              <Field label="Plan">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {PLANS.map((p) => {
                    const cfg = PLAN_CONFIG[p];
                    const active = form.plan === p;
                    return (
                      <button
                        key={p}
                        onClick={() => set("plan", p)}
                        style={{
                          padding: "8px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                          border: `1px solid ${active ? cfg.color : inputBdr}`,
                          background: active ? cfg.bg : inputBg,
                          color: active ? cfg.color : txtSub,
                          cursor: "pointer", transition: "all 0.15s",
                          display: "flex", alignItems: "center", gap: 5,
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {/* Status selector */}
              <Field label="Status">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {STATUSES.map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    const active = form.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => set("status", s)}
                        style={{
                          padding: "7px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                          border: `1px solid ${active ? cfg.color : inputBdr}`,
                          background: active ? cfg.bg : inputBg,
                          color: active ? cfg.color : txtSub,
                          cursor: "pointer", transition: "all 0.15s",
                          display: "flex", alignItems: "center", gap: 5,
                          textAlign: "left",
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {/* Plan Expiry */}
              <Field label="Plan Expiry Date">
                <input
                  type="date"
                  value={form.planExpiry}
                  onChange={(e) => set("planExpiry", e.target.value)}
                  style={inputStyle(false)}
                  onFocus={(e) => { e.target.style.borderColor = inputFocus; }}
                  onBlur={(e)  => { e.target.style.borderColor = inputBdr; }}
                />
              </Field>
            </div>
          </div>

          {/* Limits */}
          <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 14, padding: "22px 24px" }}>
            <SectionHeader icon="⚙️" title="Usage Limits" txtMain={txtMain} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Max Students" error={errors.maxStudents}>
                <input
                  type="number"
                  min={1}
                  value={form.maxStudents}
                  onChange={(e) => set("maxStudents", e.target.value)}
                  style={inputStyle(errors.maxStudents)}
                  onFocus={(e) => { e.target.style.borderColor = inputFocus; }}
                  onBlur={(e)  => { e.target.style.borderColor = errors.maxStudents ? "#ef4444" : inputBdr; }}
                />
              </Field>

              <Field label="Max Trainers" error={errors.maxTrainers}>
                <input
                  type="number"
                  min={1}
                  value={form.maxTrainers}
                  onChange={(e) => set("maxTrainers", e.target.value)}
                  style={inputStyle(errors.maxTrainers)}
                  onFocus={(e) => { e.target.style.borderColor = inputFocus; }}
                  onBlur={(e)  => { e.target.style.borderColor = errors.maxTrainers ? "#ef4444" : inputBdr; }}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Live Preview ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 20 }}>

          {/* Preview Card */}
          <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 14, padding: "20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: txtSub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
              Live Preview
            </div>

            {/* Org avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg,${avatarA},${avatarB})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 18, fontWeight: 800,
              }}>
                {initials(form.name)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: txtMain, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {form.name || "Organization Name"}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <BadgePreview cfg={STATUS_CONFIG[form.status]} />
                  <BadgePreview cfg={PLAN_CONFIG[form.plan]} />
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ borderTop: `1px solid ${divClr}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: "🌐", val: form.domain       || "—", label: "Domain" },
                { icon: "🏭", val: form.industry     || "—", label: "Industry" },
                { icon: "📍", val: form.location     || "—", label: "Location" },
                { icon: "✉️", val: form.contactEmail || "—", label: "Email" },
              ].map(({ icon, val, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: txtSub, minWidth: 52 }}>{label}</span>
                  <span style={{ fontSize: 12, color: txtMain, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Limits row */}
            <div style={{ borderTop: `1px solid ${divClr}`, marginTop: 12, paddingTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Max Students", val: form.maxStudents, color: "#14b8a6" },
                { label: "Max Trainers", val: form.maxTrainers, color: "#8b5cf6" },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ textAlign: "center", padding: "10px 0", borderRadius: 8, background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{val || 0}</div>
                  <div style={{ fontSize: 10, color: txtSub, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div style={{ background: cardBg, border: `1px solid ${cardBdr}`, borderRadius: 14, padding: "20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: txtSub, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              Checklist
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Organization name",  done: !!form.name.trim() },
                { label: "Domain",             done: !!form.domain.trim() },
                { label: "Contact email",      done: !!form.contactEmail.trim() && /\S+@\S+\.\S+/.test(form.contactEmail) },
                { label: "Industry selected",  done: !!form.industry },
                { label: "Plan selected",      done: !!form.plan },
                { label: "Status selected",    done: !!form.status },
              ].map(({ label, done }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                    background: done ? "#10b981" : (dark ? "rgba(255,255,255,0.08)" : "#e5e7eb"),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}>
                    {done && (
                      <svg width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: done ? txtMain : txtSub, fontWeight: done ? 600 : 400 }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NewOrganizationPage;