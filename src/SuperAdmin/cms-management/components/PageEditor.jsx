import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../styles/cms.css";

/**
 * PageEditor — Modal to edit page-level metadata (title, description, published).
 *
 * Props:
 *   page      — current page object
 *   onSave    — fn(updates)
 *   onClose   — fn()
 */
const PageEditor = ({ page, onSave, onClose }) => {
  const [title, setTitle] = useState(page?.title || "");
  const [description, setDescription] = useState(page?.description || "");
  const [published, setPublished] = useState(page?.published || false);

  useEffect(() => {
    if (page) {
      setTitle(page.title || "");
      setDescription(page.description || "");
      setPublished(page.published || false);
    }
  }, [page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description, published });
  };

  return (
    <div className="cms-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cms-modal">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 className="cms-modal__title" style={{ margin: 0 }}>Page Settings</h2>
          <button className="cms-btn cms-btn--ghost" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="cms-form-field">
            <label className="cms-form-label">Page Title</label>
            <input
              type="text"
              className="cms-form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="cms-form-field">
            <label className="cms-form-label">Description</label>
            <textarea
              className="cms-form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="cms-form-field" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              className={`cms-toggle ${published ? "cms-toggle--on" : ""}`}
              onClick={() => setPublished((v) => !v)}
              aria-label="Toggle published"
            />
            <span style={{ fontSize: 13, color: "var(--cms-text)" }}>
              {published ? "Published" : "Unpublished"}
            </span>
          </div>

          <div className="cms-modal__footer">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="cms-btn cms-btn--primary">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageEditor;