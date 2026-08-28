import React, { useState } from "react";
import WorkspaceModal from "./WorkspaceModal";
import { Field, Row } from "./FormControls";

const ROLE_OPTIONS = ["Mentor", "Student", "Team", "Other"];

export default function ContactForm({ onClose, onSubmit, contactToEdit }) {
  const isEdit = Boolean(contactToEdit);

  const [name, setName] = useState(
    contactToEdit
      ? `${contactToEdit.firstName || ""} ${contactToEdit.lastName || ""}`.trim()
      : "",
  );
  const [email, setEmail] = useState(contactToEdit?.email || "");
  const [phone, setPhone] = useState(contactToEdit?.phone || "");
  const [role, setRole] = useState(contactToEdit?.role || ROLE_OPTIONS[0]);
  const [organization, setOrganization] = useState(
    contactToEdit?.organization || "",
  );
  const [notes, setNotes] = useState(contactToEdit?.notes || "");
  const [error, setError] = useState("");
  const handleSave = () => {
    if (!name.trim()) {
      setError("Enter the contact's name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      organization: organization.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <WorkspaceModal
      title={isEdit ? "Edit Contact" : "Add Contact"}
      subtitle="Save a new contact to your workspace."
      onClose={onClose}
      width={560}
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            {isEdit ? "Update Contact" : "Save Contact"}
          </button>
        </>
      }
    >
      <Field label="Name" required id="ct-name">
        <input
          id="ct-name"
          className="wm-input"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <Row cols={2}>
        <Field label="Email" required id="ct-email">
          <input
            id="ct-email"
            type="email"
            className="wm-input"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Phone" id="ct-phone">
          <input
            id="ct-phone"
            className="wm-input"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
      </Row>

      <Row cols={2}>
        <Field label="Role" id="ct-role">
          <select
            id="ct-role"
            className="wm-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Organization" id="ct-org">
          <input
            id="ct-org"
            className="wm-input"
            placeholder="e.g. ILM ORA"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </Field>
      </Row>

      <Field label="Notes" id="ct-notes">
        <textarea
          id="ct-notes"
          className="wm-textarea"
          rows={3}
          placeholder="Anything worth remembering about this contact..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>

      {error && <p className="wm-error">{error}</p>}
    </WorkspaceModal>
  );
}
