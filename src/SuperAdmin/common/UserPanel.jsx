// components/common/UserPanel.jsx
import React, { useState, useEffect } from "react";
import ResizableSlidePanel, {
  StatusDot,
  SectionLabel,
  PanelDivider,
  Field,
  PanelInput,
  PanelSelect,
  RolePills,
} from "./ResizableSlidePanel";

const ROLES = { STUDENT: "student", TRAINER: "trainer", ADMIN: "admin" };
const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING: "pending",
};

const STATUS_OPTIONS = [
  { value: USER_STATUS.ACTIVE,    label: "Active" },
  { value: USER_STATUS.INACTIVE,  label: "Inactive" },
  { value: USER_STATUS.SUSPENDED, label: "Suspended" },
  { value: USER_STATUS.PENDING,   label: "Pending" },
];

function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const UserPanel = ({
  open,
  onClose,
  onSubmit,
  initialData = null,
  defaultRole = ROLES.STUDENT,
}) => {
  const isEdit = !!initialData;

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    role: defaultRole,
    status: USER_STATUS.ACTIVE,
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Reset when panel opens/closes or data changes
  useEffect(() => {
    setForm(initialData ? { ...emptyForm, ...initialData } : { ...emptyForm, role: defaultRole });
    setErrors({});
  }, [initialData, open, defaultRole]);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email format";
    return e;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500)); // simulate async
    onSubmit(form);
    setLoading(false);
    onClose();
  };

  const set = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: typeof val === "string" ? val : val.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  // ── Avatar for header ─────────────────────────────────────────────────────
  const avatar = isEdit && form.name ? (
    <div className="
      w-9 h-9 rounded-full bg-violet-500/20 border border-violet-500/35
      flex items-center justify-center text-[13px] font-semibold text-violet-300
      flex-shrink-0
    ">
      {initials(form.name)}
    </div>
  ) : null;

  return (
    <ResizableSlidePanel
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit User" : "Create New User"}
      subtitle={isEdit ? `Editing ${form.name || "user"}` : "Fill in the details below"}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? "Save Changes" : "Create User"}
      submitIcon={
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          {isEdit
            ? <path d="M20 6L9 17l-5-5"/>
            : <path d="M12 5v14M5 12h14"/>
          }
        </svg>
      }
      loading={loading}
      avatar={avatar}
    >
      {/* ── Basic Info ── */}
      <SectionLabel>Basic Information</SectionLabel>

      <Field label="Full Name" error={errors.name}>
        <PanelInput
          type="text"
          placeholder="e.g. Rahul Sharma"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
          autoComplete="name"
        />
      </Field>

      <Field label="Email Address" error={errors.email}>
        <PanelInput
          type="email"
          placeholder="rahul@example.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
        />
      </Field>

      <Field label="Phone Number">
        <PanelInput
          type="tel"
          placeholder="+91 98765 43210"
          value={form.phone || ""}
          onChange={set("phone")}
          autoComplete="tel"
        />
      </Field>

      <PanelDivider />

      {/* ── Role ── */}
      <SectionLabel>Role</SectionLabel>
      <RolePills
        value={form.role}
        onChange={set("role")}
        roles={[ROLES.STUDENT, ROLES.TRAINER, ROLES.ADMIN]}
      />

      <PanelDivider />

      {/* ── Status ── */}
      <SectionLabel>Status</SectionLabel>

      <Field label="Account Status">
        <PanelSelect value={form.status} onChange={set("status")}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} style={{ background: "#1a1a2e" }}>
              {o.label}
            </option>
          ))}
        </PanelSelect>
        {/* Live preview */}
        <div className="flex items-center mt-2.5">
          <StatusDot status={form.status} />
          <span className="text-[12px] text-white/35">
            User will appear as{" "}
            <span className="text-white/60 font-medium">{form.status}</span>
          </span>
        </div>
      </Field>
    </ResizableSlidePanel>
  );
};

export default UserPanel;