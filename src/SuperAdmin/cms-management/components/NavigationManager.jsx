/**
 * NavigationManager.jsx
 * Manage navigation menus (Student Hub, Trainer Hub, Admin Hub).
 * Stores menus in localStorage with full CRUD + reorder.
 */

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Save, GripVertical, Globe } from "lucide-react";
import "../styles/cms.css";

const STORAGE_KEY = "cms_navigation";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const uuid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const readNav = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          "student-hub": [],
          "trainer-hub": [],
          "admin-hub": [],
        };
  } catch {
    return { "student-hub": [], "trainer-hub": [], "admin-hub": [] };
  }
};

const writeNav = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

const MENUS = [
  { key: "student-hub", label: "Student Hub" },
  { key: "trainer-hub", label: "Trainer Hub" },
  { key: "admin-hub", label: "Admin Hub" },
];

// ─── NavItemRow ───────────────────────────────────────────────────────────────

const NavItemRow = ({ item, onEdit, onDelete }) => (
  <div className="cms-component-row">
    <div className="cms-component-row__left">
      <GripVertical size={14} style={{ color: "var(--cms-text-muted)", cursor: "grab" }} />
      <div>
        <div className="cms-component-row__label">{item.label}</div>
        <div className="cms-component-row__type">{item.href}</div>
      </div>
      {item.target === "_blank" && (
        <Globe size={12} style={{ color: "var(--cms-text-muted)", marginLeft: 4 }} title="Opens in new tab" />
      )}
    </div>
    <div className="cms-component-row__actions">
      <button className="cms-btn cms-btn--ghost" onClick={() => onEdit(item)} title="Edit">
        <Edit2 size={13} />
      </button>
      <button
        className="cms-btn cms-btn--ghost"
        onClick={() => onDelete(item.id)}
        title="Delete"
        style={{ color: "var(--cms-danger)" }}
      >
        <Trash2 size={13} />
      </button>
    </div>
  </div>
);

// ─── ItemEditor Modal ─────────────────────────────────────────────────────────

const ItemEditorModal = ({ item, onSave, onClose }) => {
  const [label, setLabel] = useState(item?.label || "");
  const [href, setHref] = useState(item?.href || "/");
  const [target, setTarget] = useState(item?.target || "_self");

  const handleSave = () => {
    if (!label.trim() || !href.trim()) return;
    onSave({ ...item, label: label.trim(), href: href.trim(), target });
    onClose();
  };

  return (
    <div className="cms-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cms-modal" style={{ minWidth: 420 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 className="cms-modal__title" style={{ margin: 0 }}>
            {item?.id ? "Edit Nav Item" : "Add Nav Item"}
          </h2>
          <button className="cms-btn cms-btn--ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="cms-form-field">
          <label className="cms-form-label">Label</label>
          <input
            className="cms-form-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Home"
            autoFocus
          />
        </div>

        <div className="cms-form-field">
          <label className="cms-form-label">Link (href)</label>
          <input
            className="cms-form-input"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="e.g. /dashboard"
          />
        </div>

        <div className="cms-form-field">
          <label className="cms-form-label">Open in</label>
          <select
            className="cms-form-select"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="_self">Same tab</option>
            <option value="_blank">New tab</option>
          </select>
        </div>

        <div className="cms-modal__footer">
          <button className="cms-btn cms-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="cms-btn cms-btn--primary" onClick={handleSave}>
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── NavigationManager ────────────────────────────────────────────────────────

/**
 * Props:
 *   onClose — fn() optional — when used as a modal
 */
const NavigationManager = ({ onClose }) => {
  const [navData, setNavData] = useState({ "student-hub": [], "trainer-hub": [], "admin-hub": [] });
  const [activeMenu, setActiveMenu] = useState("student-hub");
  const [editingItem, setEditingItem] = useState(null); // null | {} | item
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setNavData(readNav());
  }, []);

  const save = (updated) => {
    setNavData(updated);
    writeNav(updated);
  };

  const menuItems = navData[activeMenu] || [];

  // ─── CRUD ──────────────────────────────────────────────────────────────

  const handleAdd = () => {
    setEditingItem(null);
    setShowEditor(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowEditor(true);
  };

  const handleSaveItem = (itemData) => {
    const current = navData[activeMenu] || [];
    let updated;
    if (itemData.id) {
      updated = current.map((i) => (i.id === itemData.id ? itemData : i));
    } else {
      updated = [...current, { ...itemData, id: uuid(), order: current.length }];
    }
    save({ ...navData, [activeMenu]: updated });
  };

  const handleDelete = (id) => {
    const updated = (navData[activeMenu] || []).filter((i) => i.id !== id);
    save({ ...navData, [activeMenu]: updated });
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    const arr = [...menuItems];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    save({ ...navData, [activeMenu]: arr });
  };

  const handleMoveDown = (idx) => {
    if (idx === menuItems.length - 1) return;
    const arr = [...menuItems];
    [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
    save({ ...navData, [activeMenu]: arr });
  };

  return (
    <>
      <div className="cms-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div
          className="cms-modal"
          style={{ minWidth: 620, maxHeight: "88vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h2 className="cms-modal__title" style={{ margin: 0 }}>
              🗺️ Navigation Manager
            </h2>
            {onClose && (
              <button className="cms-btn cms-btn--ghost" onClick={onClose}>
                <X size={18} />
              </button>
            )}
          </div>

          {/* Menu Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {MENUS.map((m) => (
              <button
                key={m.key}
                className={`cms-btn ${activeMenu === m.key ? "cms-btn--primary" : "cms-btn--ghost"} cms-btn--sm`}
                onClick={() => setActiveMenu(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Items */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: "var(--cms-text-muted)" }}>
              {menuItems.length} item{menuItems.length !== 1 ? "s" : ""}
            </div>
            <button className="cms-btn cms-btn--primary cms-btn--sm" onClick={handleAdd}>
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div style={{ maxHeight: 340, overflowY: "auto", paddingRight: 4 }}>
            {menuItems.length === 0 ? (
              <div className="cms-empty">
                No navigation items yet. Click "Add Item" to create one.
              </div>
            ) : (
              menuItems.map((item, idx) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <button
                      className="cms-btn cms-btn--ghost"
                      style={{ padding: "2px 4px", fontSize: 10 }}
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                    >
                      ▲
                    </button>
                    <button
                      className="cms-btn cms-btn--ghost"
                      style={{ padding: "2px 4px", fontSize: 10 }}
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === menuItems.length - 1}
                    >
                      ▼
                    </button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <NavItemRow item={item} onEdit={handleEdit} onDelete={handleDelete} />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cms-modal__footer">
            <span style={{ fontSize: 12, color: "var(--cms-text-muted)" }}>
              Changes saved automatically to localStorage
            </span>
            {onClose && (
              <button className="cms-btn cms-btn--ghost" onClick={onClose}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Item Editor */}
      {showEditor && (
        <ItemEditorModal
          item={editingItem}
          onSave={handleSaveItem}
          onClose={() => { setShowEditor(false); setEditingItem(null); }}
        />
      )}
    </>
  );
};

export default NavigationManager;
