// export default OrganizationPage;
// OrganizationPage.jsx — connected to real backend API
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import userService from "../../services/userService";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const STATUS_CONFIG = {
  active: { label: "Active", bg: "#dcfce7", color: "#16a34a", dot: "#16a34a" },
  inactive: {
    label: "Inactive",
    bg: "#fee2e2",
    color: "#dc2626",
    dot: "#dc2626",
  },
  trial: { label: "Trial", bg: "#fef9c3", color: "#ca8a04", dot: "#ca8a04" },
};

const PLAN_CONFIG = {
  free: { label: "Free", bg: "#f1f5f9", color: "#64748b" },
  trial: { label: "Trial", bg: "#fef9c3", color: "#ca8a04" },
  pro: { label: "Pro", bg: "#ede9fe", color: "#7c3aed" },
  enterprise: { label: "Enterprise", bg: "#dbeafe", color: "#1d4ed8" },
};

// Map backend org shape → UI shape
function mapOrg(o) {
  return {
    id: o.id,
    name: o.name || "—",
    email: o.email || "—",
    city: o.city || "—",
    phone: o.phone || "—",
    plan: (o.plan || "trial").toLowerCase(),
    status: (o.status || "active").toLowerCase(),
    managerName: o.managerName || "—",
    managerEmail: o.managerEmail || "—",
    ownerId: o.ownerId || null,
    createdAt: o.createdAt || null,
    updatedAt: o.updatedAt || null,
  };
}

// ─────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────
const Badge = ({ cfg }) => {
  if (!cfg) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 700,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      {cfg.dot && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: cfg.dot,
          }}
        />
      )}
      {cfg.label}
    </span>
  );
};

// ─────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────
const AVATAR_COLORS = [
  ["#6366f1", "#818cf8"],
  ["#8b5cf6", "#a78bfa"],
  ["#ec4899", "#f472b6"],
  ["#14b8a6", "#2dd4bf"],
  ["#f59e0b", "#fbbf24"],
  ["#10b981", "#34d399"],
  ["#3b82f6", "#60a5fa"],
  ["#ef4444", "#f87171"],
];
const avatarGrad = (name = "") =>
  AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "??";

const OrgAvatar = ({ name, size = 38 }) => {
  const [a, b] = avatarGrad(name);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: `linear-gradient(135deg,${a},${b})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: size * 0.33,
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  );
};

// ─────────────────────────────────────────────
// SIDE PANEL
// ─────────────────────────────────────────────
const OrgDetailsPanel = ({
  org,
  onClose,
  onStatusToggle,
  onDeleteClick,
  dark,
}) => {
  const navigate = useNavigate();
  const [capacity, setCapacity] = useState(null);

  // ── NEW: inline edit state ──
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [onboardingData, setOnboardingData] = useState(null);

  useEffect(() => {
    if (!org?.id) return;
    authService
      .getOrgCapacity(org.id)
      .then(setCapacity)
      .catch(() => {});
  }, [org?.id]);

  useEffect(() => {
    if (!org?.managerEmail) return;
    authService
      .getAdminOnboardingByEmail(org.managerEmail)
      .then((data) => {
        setOnboardingData(data || null);
      })
      .catch(() => {});
  }, [org?.managerEmail]);

  if (!org) return null;

  const panelBg = dark ? "#0f1117" : "#fff";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub = dark ? "#64748b" : "#94a3b8";
  const divClr = dark ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  const Row = ({ label, value, color }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "9px 0",
        borderBottom: `1px solid ${divClr}`,
      }}
    >
      <span style={{ fontSize: 12, color: txtSub }}>{label}</span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: color || txtMain,
          maxWidth: 180,
          textAlign: "right",
          wordBreak: "break-all",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );

  const statusCfg = STATUS_CONFIG[(org.status || "active").toLowerCase()];
  const planCfg = PLAN_CONFIG[(org.plan || "trial").toLowerCase()];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.42)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: 360,
          height: "100%",
          background: panelBg,
          borderLeft: dark
            ? "1px solid rgba(255,255,255,0.10)"
            : "1px solid #e5e7eb",
          padding: "24px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflowY: "auto",
          animation: "slideIn 0.22s ease",
        }}
      >
        <style>{`@keyframes slideIn { from { transform:translateX(30px); opacity:0; } to { transform:translateX(0); opacity:1; } } @keyframes spin { to { transform:rotate(360deg); } }`}</style>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <OrgAvatar name={org.name} size={44} />
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: txtMain,
                  lineHeight: 1.2,
                }}
              >
                {org.name}
              </div>
              <div style={{ fontSize: 11, color: txtSub, marginTop: 3 }}>
                {org.email}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: txtSub,
              padding: 4,
            }}
          >
            <svg
              width={15}
              height={15}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 6 }}>
          <Badge cfg={statusCfg} />
          <Badge cfg={planCfg} />
        </div>

        {/* Owner / Manager info */}
        <div
          style={{
            background: dark ? "rgba(99,102,241,0.08)" : "#f0f0ff",
            border: `1px solid ${dark ? "rgba(99,102,241,0.25)" : "#c7d2fe"}`,
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#6366f1",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            Organization Owner
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials(org.managerName)}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: txtMain }}>
                {org.managerName}
              </div>
              <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 500 }}>
                {org.managerEmail}
              </div>
            </div>
          </div>
        </div>

        {/* ── Organization Details ── */}
        <div
          style={{
            background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc",
            border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}`,
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          {/* Header row with Edit / Save / Cancel */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: txtMain,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Organization Details
            </div>

            {/* ── EDIT / SAVE / CANCEL buttons ── */}
            {!editing ? (
              <button
                onClick={() => {
                  // setEditForm({
                  //   name: org.name,
                  //   email: org.email,
                  //   city: org.city,
                  //   phone: org.phone,
                  //   plan: org.plan,
                  //   status: org.status,
                  //   managerName: org.managerName,
                  //   managerEmail: org.managerEmail,
                  //   // maxStudents: ownerProfile?.maxStudents ?? "",
                  //   // maxTrainers: ownerProfile?.maxTrainers ?? "",
                  //   maxStudents: capacity?.maxStudents ?? "",
                  //   maxTrainers: capacity?.maxTrainers ?? "",
                  // });
                  setEditForm({
                    // Super admin fields
                    name: org.name,
                    email: org.email,
                    city: org.city,
                    phone: org.phone,
                    plan: org.plan,
                    status: org.status,
                    managerName: org.managerName,
                    managerEmail: org.managerEmail,
                    maxStudents: capacity?.maxStudents ?? "",
                    maxTrainers: capacity?.maxTrainers ?? "",
                    maxDepartments: capacity?.maxDepartments ?? "",
                    maxBranchesPerDept: capacity?.maxBranchesPerDept ?? "",
                    maxBatchesPerBranch: capacity?.maxBatchesPerBranch ?? "",
                    // ✅ Admin self-fill fields pre-populated from capacity
                    organizationName: capacity?.organizationName ?? "",
                    domain: capacity?.domain ?? "",
                    contactEmail: capacity?.contactEmail ?? "",
                    location: capacity?.location ?? "",
                    industry: capacity?.industry ?? "",
                    description: capacity?.description ?? "",
                    mobileNumber: capacity?.mobileNumber ?? "",
                  });
                  setEditing(true);
                }}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid #6366f140",
                  background: "#6366f110",
                  color: "#6366f1",
                  cursor: "pointer",
                }}
              >
                ✏️ Edit
              </button>
            ) : (
              <div style={{ display: "flex", gap: 5 }}>
                <button
                  onClick={() => setEditing(false)}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 9px",
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  // onClick={async () => {
                  //   setSaving(true);
                  //   try {
                  //     await authService.updateOrganization(org.id, {
                  //       name: editForm.name,
                  //       email: editForm.email,
                  //       city: editForm.city,
                  //       phone: editForm.phone,
                  //       plan: editForm.plan,
                  //       status: editForm.status,
                  //       managerName: editForm.managerName,
                  //       managerEmail: editForm.managerEmail,
                  //       maxStudents: editForm.maxStudents
                  //         ? parseInt(editForm.maxStudents)
                  //         : null,
                  //       maxTrainers: editForm.maxTrainers
                  //         ? parseInt(editForm.maxTrainers)
                  //         : null,
                  //     });
                  //     setEditing(false);
                  //     onClose();
                  //     window.location.reload();
                  //   } catch (err) {
                  //     alert("Failed to save. Please try again.");
                  //   } finally {
                  //     setSaving(false);
                  //   }
                  // }}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      // ✅ Call 1: Super admin locked fields (name, plan, limits etc.)
                      await authService.updateOrganization(org.id, {
                        name: editForm.name,
                        email: editForm.email,
                        city: editForm.city,
                        phone: editForm.phone,
                        plan: editForm.plan,
                        status: editForm.status,
                        managerName: editForm.managerName,
                        managerEmail: editForm.managerEmail,
                        maxStudents: editForm.maxStudents
                          ? parseInt(editForm.maxStudents)
                          : null,
                        maxTrainers: editForm.maxTrainers
                          ? parseInt(editForm.maxTrainers)
                          : null,
                        maxDepartments: editForm.maxDepartments
                          ? parseInt(editForm.maxDepartments)
                          : null,
                        maxBranchesPerDept: editForm.maxBranchesPerDept
                          ? parseInt(editForm.maxBranchesPerDept)
                          : null,
                        maxBatchesPerBranch: editForm.maxBatchesPerBranch
                          ? parseInt(editForm.maxBatchesPerBranch)
                          : null,
                      });

                      // ✅ Call 2: Admin self-fill fields (org profile details)
                      await authService.updateAdminOrgProfile(org.id, {
                        organizationName: editForm.organizationName,
                        domain: editForm.domain,
                        contactEmail: editForm.contactEmail,
                        location: editForm.location,
                        industry: editForm.industry,
                        description: editForm.description,
                        mobileNumber: editForm.mobileNumber,
                      });

                      setEditing(false);
                      onClose();
                      window.location.reload();
                    } catch (err) {
                      alert("Failed to save. Please try again.");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "none",
                    background: "#6366f1",
                    color: "#fff",
                    cursor: "pointer",
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? "Saving…" : "💾 Save"}
                </button>
              </div>
            )}
          </div>

          {/* Static org fields */}
          <Row label="Created" value={formatDate(org.createdAt)} />
          <Row label="Updated" value={formatDate(org.updatedAt)} />

          {/* ── INLINE EDIT FORM (shown only when editing) ── */}
          {editing && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {[
                // { key: "name", label: "Org Name" },
                // { key: "email", label: "Email" },
                // { key: "city", label: "City" },
                // { key: "phone", label: "Phone" },
                // { key: "managerName", label: "Manager Name" },
                // { key: "managerEmail", label: "Manager Email" },
                // { key: "maxStudents", label: "Max Students" },
                // { key: "maxTrainers", label: "Max Trainers" },
                { key: "name", label: "Org Name" },
                { key: "email", label: "Email" },
                { key: "city", label: "City" },
                { key: "phone", label: "Phone" },
                { key: "managerName", label: "Manager Name" },
                { key: "managerEmail", label: "Manager Email" },
                { key: "maxStudents", label: "Max Students" },
                { key: "maxTrainers", label: "Max Trainers" },
                { key: "maxDepartments", label: "Max Departments" },
                { key: "maxBranchesPerDept", label: "Max Branches Per Dept" },
                { key: "maxBatchesPerBranch", label: "Max Batches Per Branch" },
                // ✅ Admin self-fill fields
                { key: "organizationName", label: "Organization Name" },
                { key: "domain", label: "Domain" },
                { key: "contactEmail", label: "Contact Email" },
                { key: "location", label: "Location" },
                { key: "industry", label: "Industry" },
                { key: "description", label: "Description" },
                { key: "mobileNumber", label: "Mobile Number" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: 3,
                    }}
                  >
                    {label}
                  </div>
                  <input
                    value={editForm[key] || ""}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "6px 9px",
                      borderRadius: 7,
                      border: "1.5px solid #6366f140",
                      fontSize: 12,
                      background: "#6366f106",
                      color: "#1e293b",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              {/* Plan dropdown */}
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 3,
                  }}
                >
                  Plan
                </div>
                <select
                  value={editForm.plan || "trial"}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, plan: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "6px 9px",
                    borderRadius: 7,
                    border: "1.5px solid #6366f140",
                    fontSize: 12,
                    background: "#6366f106",
                    color: "#1e293b",
                    outline: "none",
                  }}
                >
                  {["free", "trial", "pro", "enterprise"].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status dropdown */}
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 3,
                  }}
                >
                  Status
                </div>
                <select
                  value={editForm.status || "active"}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "6px 9px",
                    borderRadius: 7,
                    border: "1.5px solid #6366f140",
                    fontSize: 12,
                    background: "#6366f106",
                    color: "#1e293b",
                    outline: "none",
                  }}
                >
                  {["active", "inactive", "trial"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {!editing && (
            <>
              {capacity ? (
                <>
                  {[
                    {
                      label: "Organization Name",
                      val: capacity.organizationName,
                    },
                    { label: "Domain", val: capacity.domain },
                    { label: "Contact Email", val: capacity.contactEmail },
                    { label: "Location", val: capacity.location },
                    { label: "Industry", val: capacity.industry },
                    { label: "Mobile Number", val: capacity.mobileNumber },
                    { label: "Description", val: capacity.description },
                    { label: "Plan", val: capacity.plan },
                    { label: "Status", val: capacity.status },
                    { label: "Plan Expiry", val: capacity.planExpiryDate },
                    { label: "Max Students", val: capacity.maxStudents },
                    { label: "Max Trainers", val: capacity.maxTrainers },
                    { label: "Max Departments", val: capacity.maxDepartments },
                    {
                      label: "Max Branches/Dept",
                      val: capacity.maxBranchesPerDept,
                    },
                    {
                      label: "Max Batches/Branch",
                      val: capacity.maxBatchesPerBranch,
                    },
                  ]
                    .filter(({ val }) => val != null && val !== "")
                    .map(({ label, val }) => (
                      <Row key={label} label={label} value={String(val)} />
                    ))}
                </>
              ) : (
                <div
                  style={{ fontSize: 12, color: "#94a3b8", padding: "8px 0" }}
                >
                  No profile details filled yet.
                </div>
              )}
            </>
          )}
        </div>

        {/* Members with real capacity */}
        <div
          style={{
            background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc",
            border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}`,
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: txtMain,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 10,
            }}
          >
            Members
          </div>

          {/* Trainers row */}
          <div
            style={{ padding: "6px 0", borderBottom: `1px solid ${divClr}` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 12, color: txtSub }}>Trainers</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color:
                    capacity?.maxTrainers != null &&
                    (capacity?.currentTrainers || 0) >= capacity.maxTrainers
                      ? "#ef4444"
                      : "#8b5cf6",
                }}
              >
                {capacity
                  ? `${capacity.currentTrainers ?? 0} / ${capacity.maxTrainers ?? "∞"}`
                  : "—"}
              </span>
            </div>
            {capacity?.maxTrainers != null && (
              <div
                style={{
                  height: 4,
                  borderRadius: 2,
                  background: "#e2e8f0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, ((capacity.currentTrainers || 0) / capacity.maxTrainers) * 100)}%`,
                    background:
                      (capacity.currentTrainers || 0) >= capacity.maxTrainers
                        ? "#ef4444"
                        : "#8b5cf6",
                    borderRadius: 2,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            )}
          </div>

          {/* Students row */}
          <div
            style={{ padding: "6px 0", borderBottom: `1px solid ${divClr}` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 12, color: txtSub }}>Students</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color:
                    capacity?.maxStudents != null &&
                    (capacity?.currentStudents || 0) >= capacity.maxStudents
                      ? "#ef4444"
                      : "#14b8a6",
                }}
              >
                {capacity
                  ? `${capacity.currentStudents ?? 0} / ${capacity.maxStudents ?? "∞"}`
                  : "—"}
              </span>
            </div>
            {capacity?.maxStudents != null && (
              <div
                style={{
                  height: 4,
                  borderRadius: 2,
                  background: "#e2e8f0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, ((capacity.currentStudents || 0) / capacity.maxStudents) * 100)}%`,
                    background:
                      (capacity.currentStudents || 0) >= capacity.maxStudents
                        ? "#ef4444"
                        : "#14b8a6",
                    borderRadius: 2,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ padding: "6px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, color: txtSub }}>Batches</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6" }}>
                coming soon
              </span>
            </div>
          </div>
        </div>
        {/* ── Admin Onboarding Responses ── */}
        {onboardingData &&
          onboardingData.onboardingAnswers &&
          Object.keys(onboardingData.onboardingAnswers).length > 0 && (
            <div
              style={{
                background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e5e7eb"}`,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: txtMain,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: 10,
                }}
              >
                Admin Onboarding Responses
              </div>
              {Object.entries(onboardingData.onboardingAnswers)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([stepKey, selections]) => {
                  const stepLabels = {
                    step_0: "What do you want to manage?",
                    step_1: "Organization type?",
                    step_2: "Team size?",
                    step_3: "Key tools needed?",
                    step_4: "Primary goal?",
                    step_5: "Where to start?",
                  };
                  return (
                    <div
                      key={stepKey}
                      style={{
                        padding: "7px 0",
                        borderBottom: `1px solid ${divClr}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: txtSub,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          marginBottom: 5,
                        }}
                      >
                        {stepLabels[stepKey] || stepKey}
                      </div>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 4 }}
                      >
                        {(Array.isArray(selections) ? selections : []).map(
                          (sel, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                padding: "3px 8px",
                                borderRadius: 20,
                                background: "#6366f115",
                                color: "#6366f1",
                                border: "1px solid #6366f130",
                              }}
                            >
                              {sel}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: "auto",
          }}
        >
          <button
            onClick={() => {
              onClose();
              navigate(`/superadmin/organizations/${org.id}`);
            }}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <svg
              width={13}
              height={13}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            </svg>
            View Full Details
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onStatusToggle(org)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                background: org.status === "active" ? "#fee2e2" : "#dcfce7",
                color: org.status === "active" ? "#dc2626" : "#16a34a",
              }}
            >
              {org.status === "active" ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => onDeleteClick(org)}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                background: "#fee2e2",
                color: "#dc2626",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ORG ROW
// ─────────────────────────────────────────────
const OrgRow = ({
  org,
  dark,
  txtMain,
  txtSub,
  border,
  onRowClick,
  onStatusToggle,
  onDeleteClick,
}) => {
  const [hov, setHov] = useState(false);
  const statusCfg = STATUS_CONFIG[(org.status || "active").toLowerCase()];
  const planCfg = PLAN_CONFIG[(org.plan || "trial").toLowerCase()];

  return (
    <div
      onClick={onRowClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "2.2fr 1fr 1fr 1fr 120px",
        padding: "13px 18px",
        cursor: "pointer",
        background: hov
          ? dark
            ? "rgba(255,255,255,0.04)"
            : "#f8fafc"
          : "transparent",
        transition: "background 0.15s",
        borderBottom: `1px solid ${border}`,
        alignItems: "center",
      }}
    >
      {/* Name + email */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <OrgAvatar name={org.name} size={34} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: txtMain }}>
            {org.name}
          </div>
          <div style={{ fontSize: 11, color: txtSub }}>{org.email}</div>
        </div>
      </div>

      {/* Status */}
      <div>
        <Badge cfg={statusCfg} />
      </div>

      {/* Plan */}
      <div>
        <Badge cfg={planCfg} />
      </div>

      {/* Owner */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: txtMain }}>
          {org.managerName}
        </div>
        <div
          style={{
            fontSize: 11,
            color: txtSub,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 160,
          }}
        >
          {org.managerEmail}
        </div>
      </div>

      {/* Actions */}
      <div
        style={{ display: "flex", gap: 6 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onStatusToggle(org)}
          title={org.status === "active" ? "Deactivate" : "Activate"}
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: org.status === "active" ? "#dcfce7" : "#fee2e2",
            color: org.status === "active" ? "#16a34a" : "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            {org.status === "active" ? (
              <path d="M18.36 6.64A9 9 0 0 1 20.77 15M6.16 6.16a9 9 0 1 0 12.68 12.68M2 2l20 20" />
            ) : (
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10" />
            )}
          </svg>
        </button>
        <button
          onClick={() => onDeleteClick(org)}
          title="Delete"
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: "#fee2e2",
            color: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const OrganizationPage = () => {
  const navigate = useNavigate();
  const dark = false;

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const [selectedOrg, setSelectedOrg] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch orgs from backend ──
  useEffect(() => {
    setLoading(true);
    authService
      .getAllOrganizations()
      .then((data) => {
        setOrganizations((data || []).map(mapOrg));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load organizations:", err);
        setApiError("Failed to load organizations. Please try again.");
        setLoading(false);
      });
  }, []);

  // ── Filter ──
  const filtered = useMemo(() => {
    return organizations.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.name?.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.managerName?.toLowerCase().includes(q) ||
        o.managerEmail?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchPlan = planFilter === "all" || o.plan === planFilter;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [organizations, search, statusFilter, planFilter]);

  // ── Status toggle ──
  const handleStatusToggle = async (org) => {
    const next = org.status === "active" ? "inactive" : "active";
    setActionLoading(true);
    try {
      await authService.updateOrganizationStatus(org.id, next);
      setOrganizations((prev) =>
        prev.map((o) => (o.id === org.id ? { ...o, status: next } : o)),
      );
      if (selectedOrg?.id === org.id)
        setSelectedOrg((v) => (v ? { ...v, status: next } : v));
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Delete ──
  const confirmDeleteOrg = async () => {
    if (!confirmDelete) return;
    setActionLoading(true);
    try {
      await authService.deleteOrganizationById(confirmDelete.id);
      setOrganizations((prev) => prev.filter((o) => o.id !== confirmDelete.id));
      if (selectedOrg?.id === confirmDelete.id) setSelectedOrg(null);
      setConfirmDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete organization.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Colors ──
  const bg = dark ? "#0a0d14" : "#f8fafc";
  const cardBg = dark ? "#0f1117" : "#fff";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtSub = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const inputBg = dark ? "#1e2330" : "#f1f5f9";

  const activeCount = organizations.filter((o) => o.status === "active").length;

  // ── Loading ──
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 12,
          fontFamily: "Inter,sans-serif",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid #e2e8f0",
            borderTop: "3px solid #6366f1",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, color: "#94a3b8" }}>
          Loading organizations…
        </span>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    );

  // ── Error ──
  if (apiError)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 12,
          fontFamily: "Inter,sans-serif",
        }}
      >
        <div style={{ fontSize: 32 }}>⚠️</div>
        <span style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>
          {apiError}
        </span>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );

  return (
    <div
      style={{
        background: bg,
        padding: "28px 32px",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
      }}
    >
      <style>{`@keyframes spin { to { transform:rotate(360deg); } } * { box-sizing:border-box; }`}</style>

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: txtMain,
              margin: 0,
            }}
          >
            Organizations
          </h1>
          <p style={{ fontSize: 13, color: txtSub, margin: "4px 0 0" }}>
            {organizations.length} total · {activeCount} active
          </p>
        </div>
        <button
          onClick={() => navigate("/superadmin/organizations/new")}
          style={{
            padding: "9px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 2px 10px rgba(99,102,241,0.35)",
          }}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Organization
        </button>
      </div>

      {/* ── Stat pills ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {[
          {
            label: "Total",
            val: organizations.length,
            color: "#6366f1",
            bg: "#eef2ff",
          },
          {
            label: "Active",
            val: organizations.filter((o) => o.status === "active").length,
            color: "#16a34a",
            bg: "#dcfce7",
          },
          {
            label: "Trial",
            val: organizations.filter((o) => o.plan === "trial").length,
            color: "#ca8a04",
            bg: "#fef9c3",
          },
          {
            label: "Inactive",
            val: organizations.filter((o) => o.status === "inactive").length,
            color: "#dc2626",
            bg: "#fee2e2",
          },
        ].map(({ label, val, color, bg: pillBg }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 14px",
              borderRadius: 99,
              background: pillBg,
              border: `1px solid ${color}25`,
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 800, color }}>{val}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke={txtSub}
            strokeWidth={2}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, owner…"
            style={{
              width: "100%",
              padding: "8px 12px 8px 30px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: inputBg,
              color: txtMain,
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        {[
          [
            statusFilter,
            setStatusFilter,
            ["all", "active", "inactive", "trial"],
            "All Status",
          ],
          [
            planFilter,
            setPlanFilter,
            ["all", "free", "trial", "pro", "enterprise"],
            "All Plans",
          ],
        ].map(([val, setter, opts, placeholder], i) => (
          <select
            key={i}
            value={val}
            onChange={(e) => setter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: inputBg,
              color: txtMain,
              fontSize: 13,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {opts.map((o) => (
              <option key={o} value={o}>
                {o === "all"
                  ? placeholder
                  : o.charAt(0).toUpperCase() + o.slice(1)}
              </option>
            ))}
          </select>
        ))}
        <span
          style={{
            fontSize: 11,
            color: txtSub,
            alignSelf: "center",
            marginLeft: "auto",
          }}
        >
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div
        style={{
          background: cardBg,
          borderRadius: 14,
          border: `1px solid ${border}`,
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.2fr 1fr 1fr 1fr 120px",
            padding: "10px 18px",
            background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc",
            borderBottom: `1px solid ${border}`,
          }}
        >
          {["Organization", "Status", "Plan", "Owner / Manager", "Actions"].map(
            (h) => (
              <div
                key={h}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: txtSub,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {h}
              </div>
            ),
          )}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "52px 0", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🏢</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: txtMain }}>
              No organizations found
            </div>
            <div style={{ fontSize: 12, color: txtSub, marginTop: 4 }}>
              {search
                ? "Try a different search term"
                : "Create your first organization to get started"}
            </div>
          </div>
        ) : (
          filtered.map((org) => (
            <OrgRow
              key={org.id}
              org={org}
              dark={dark}
              txtMain={txtMain}
              txtSub={txtSub}
              border={border}
              onRowClick={() => setSelectedOrg(org)}
              onStatusToggle={handleStatusToggle}
              onDeleteClick={setConfirmDelete}
            />
          ))
        )}
      </div>

      {/* ── Side Panel ── */}
      {selectedOrg && (
        <OrgDetailsPanel
          org={selectedOrg}
          dark={dark}
          onClose={() => setSelectedOrg(null)}
          onStatusToggle={handleStatusToggle}
          onDeleteClick={(org) => {
            setSelectedOrg(null);
            setConfirmDelete(org);
          }}
        />
      )}

      {/* ── Delete Confirm ── */}
      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: cardBg,
              borderRadius: 14,
              padding: "28px 32px",
              width: 380,
              border: `1px solid ${border}`,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                </svg>
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: txtMain,
                  marginBottom: 6,
                }}
              >
                Delete Organization?
              </div>
              <div style={{ fontSize: 13, color: txtSub, lineHeight: 1.5 }}>
                This will permanently delete{" "}
                <strong style={{ color: txtMain }}>{confirmDelete.name}</strong>
                . This action cannot be undone.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  background: inputBg,
                  color: txtMain,
                  border: `1px solid ${border}`,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrg}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                {actionLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationPage;
