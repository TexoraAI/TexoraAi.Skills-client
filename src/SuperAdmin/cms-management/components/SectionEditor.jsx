import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SECTION_REGISTRY } from "../renderer/componentRegistry";
import "../styles/cms.css";

/**
 * SectionEditor — Modal for creating or editing a CMS section.
 *
 * Props:
 *   initial    — existing section object for edit mode
 *   onSave     — fn(sectionData)
 *   onClose    — fn()
 *   allowedTypes — optional array of type strings to restrict choices
 */
const SectionEditor = ({ initial = null, onSave, onClose, allowedTypes }) => {
  const typeOptions = allowedTypes
    ? allowedTypes
    : Object.keys(SECTION_REGISTRY);

  const [type, setType] = useState(initial?.type || typeOptions[0] || "");
  const [label, setLabel] = useState(initial?.label || "");
  const [title, setTitle] = useState(initial?.data?.title || "");

  useEffect(() => {
    if (initial) {
      setType(initial.type || typeOptions[0]);
      setLabel(initial.label || "");
      setTitle(initial.data?.title || "");
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      type,
      label: label || SECTION_REGISTRY[type]?.label || type,
      data: { title },
    });
  };

  return (
    <div className="cms-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cms-modal">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 className="cms-modal__title" style={{ margin: 0 }}>
            {initial ? "Edit Section" : "Add Section"}
          </h2>
          <button className="cms-btn cms-btn--ghost" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="cms-form-field">
            <label className="cms-form-label">Section Type</label>
            <select
              className="cms-form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={!!initial}
            >
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {SECTION_REGISTRY[t]?.label || t}
                </option>
              ))}
            </select>
          </div>

          <div className="cms-form-field">
            <label className="cms-form-label">Display Label</label>
            <input
              type="text"
              className="cms-form-input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Hero Banner"
            />
          </div>

          <div className="cms-form-field">
            <label className="cms-form-label">Section Title (optional)</label>
            <input
              type="text"
              className="cms-form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Why Choose Us"
            />
          </div>

          <div className="cms-modal__footer">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="cms-btn cms-btn--primary">
              {initial ? "Update Section" : "Add Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionEditor;