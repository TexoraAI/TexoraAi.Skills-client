import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getComponentMeta } from "../renderer/componentRegistry";
import "../styles/cms.css";

/**
 * ComponentEditor — Modal for creating or editing a CMS component.
 *
 * Props:
 *   type       — component type string (e.g. "FeatureCard")
 *   initial    — existing data object for edit mode
 *   onSave     — fn(data) called on submit
 *   onClose    — fn() closes the modal
 */
const ComponentEditor = ({ type, initial = {}, onSave, onClose }) => {
  const meta = getComponentMeta(type);
  const [form, setForm] = useState({ ...meta.defaultData, ...initial });

  useEffect(() => {
    setForm({ ...meta.defaultData, ...initial });
  }, [type, initial]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const renderField = (field) => {
    const value = form[field.key] ?? "";
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            key={field.key}
            className="cms-form-textarea"
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.label}
          />
        );
      case "select":
        return (
          <select
            key={field.key}
            className="cms-form-select"
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
          >
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case "number":
        return (
          <input
            key={field.key}
            type="number"
            className="cms-form-input"
            value={value}
            onChange={(e) => handleChange(field.key, Number(e.target.value))}
            placeholder={field.label}
          />
        );
      case "date":
        return (
          <input
            key={field.key}
            type="date"
            className="cms-form-input"
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        );
      default:
        return (
          <input
            key={field.key}
            type="text"
            className="cms-form-input"
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.label}
          />
        );
    }
  };

  return (
    <div className="cms-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cms-modal">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 className="cms-modal__title" style={{ margin: 0 }}>
            {initial?.title || initial?.name ? "Edit" : "Add"} {meta.label}
          </h2>
          <button className="cms-btn cms-btn--ghost" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {meta.fields.length === 0 && (
            <p style={{ color: "var(--cms-text-muted)", fontSize: 13 }}>
              This component has no editable fields.
            </p>
          )}
          {meta.fields.map((field) => (
            <div key={field.key} className="cms-form-field">
              <label className="cms-form-label">{field.label}</label>
              {renderField(field)}
            </div>
          ))}

          <div className="cms-modal__footer">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="cms-btn cms-btn--primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComponentEditor;