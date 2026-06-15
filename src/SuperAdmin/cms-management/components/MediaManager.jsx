/**
 * MediaManager.jsx
 * Upload, browse, copy, and delete media files stored in localStorage as base64.
 * Drop-in component usable from any CMS page.
 */

import React, { useState, useEffect, useRef } from "react";
import { Upload, Image, FileText, Trash2, Copy, X, Search, Check } from "lucide-react";
import "../styles/cms.css";

const STORAGE_KEY = "cms_media_library";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const readMedia = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeMedia = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const uuid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── MediaManager ─────────────────────────────────────────────────────────────

/**
 * Props:
 *   onClose      — fn() — closes the manager (when used as a modal)
 *   onSelect     — fn(url) — optional; triggered when user picks a file (insert mode)
 *   selectMode   — boolean — show "Insert" button instead of "Copy URL"
 */
const MediaManager = ({ onClose, onSelect, selectMode = false }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | image | file
  const [copied, setCopied] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    setItems(readMedia());
  }, []);

  // ─── Upload ──────────────────────────────────────────────────────────────

  const handleFiles = (files) => {
    setUploading(true);
    const promises = Array.from(files).map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: uuid(),
              name: file.name,
              type: file.type,
              size: file.size,
              url: e.target.result,
              uploadedAt: new Date().toISOString(),
            });
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(promises).then((newItems) => {
      const updated = [...readMedia(), ...newItems];
      writeMedia(updated);
      setItems(updated);
      setUploading(false);
    });
  };

  const onFileChange = (e) => {
    if (e.target.files?.length) handleFiles(e.target.files);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  // ─── Delete ──────────────────────────────────────────────────────────────

  const handleDelete = (id) => {
    const updated = items.filter((i) => i.id !== id);
    writeMedia(updated);
    setItems(updated);
  };

  // ─── Copy URL ────────────────────────────────────────────────────────────

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  // ─── Filter ──────────────────────────────────────────────────────────────

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "image" && item.type.startsWith("image/")) ||
      (filter === "file" && !item.type.startsWith("image/"));
    return matchSearch && matchFilter;
  });

  return (
    <div className="cms-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div
        className="cms-modal"
        style={{ minWidth: 700, maxWidth: 860, maxHeight: "88vh" }}
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
            📁 Media Manager
          </h2>
          {onClose && (
            <button className="cms-btn cms-btn--ghost" onClick={onClose}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "var(--cms-primary)" : "var(--cms-border)"}`,
            borderRadius: 10,
            padding: "28px",
            textAlign: "center",
            cursor: "pointer",
            background: dragging ? "rgba(99,102,241,0.08)" : "var(--cms-surface-2)",
            marginBottom: 18,
            transition: "all 0.2s",
          }}
        >
          <Upload size={28} style={{ color: "var(--cms-primary)", marginBottom: 8 }} />
          <div style={{ fontWeight: 600, fontSize: 14, color: "var(--cms-text)", marginBottom: 4 }}>
            {uploading ? "Uploading..." : "Drop files here or click to upload"}
          </div>
          <div style={{ fontSize: 12, color: "var(--cms-text-muted)" }}>
            Supports images, PDFs, ZIPs, and more
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={onFileChange}
            accept="image/*,.pdf,.zip,.doc,.docx,.txt"
          />
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--cms-surface-2)",
              border: "1px solid var(--cms-border)",
              borderRadius: 8,
              padding: "7px 12px",
            }}
          >
            <Search size={14} style={{ color: "var(--cms-text-muted)" }} />
            <input
              style={{
                background: "none",
                border: "none",
                outline: "none",
                fontSize: 13,
                color: "var(--cms-text)",
                flex: 1,
              }}
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {["all", "image", "file"].map((f) => (
            <button
              key={f}
              className={`cms-btn ${filter === f ? "cms-btn--primary" : "cms-btn--ghost"} cms-btn--sm`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "image" ? "Images" : "Files"}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="cms-empty">
            {items.length === 0
              ? "No media uploaded yet. Drop some files above!"
              : "No files match your search."}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 12,
              maxHeight: 380,
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {filtered.map((item) => {
              const isImage = item.type.startsWith("image/");
              return (
                <div
                  key={item.id}
                  style={{
                    background: "var(--cms-surface-2)",
                    border: "1px solid var(--cms-border)",
                    borderRadius: 10,
                    overflow: "hidden",
                    position: "relative",
                    cursor: selectMode ? "pointer" : "default",
                  }}
                  onClick={() => selectMode && onSelect?.(item.url)}
                >
                  {/* Preview */}
                  <div
                    style={{
                      height: 100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--cms-bg)",
                      overflow: "hidden",
                    }}
                  >
                    {isImage ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <FileText size={36} style={{ color: "var(--cms-text-muted)" }} />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "8px 10px" }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--cms-text)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--cms-text-muted)", marginTop: 2 }}>
                      {formatSize(item.size)}
                    </div>
                  </div>

                  {/* Actions */}
                  {!selectMode && (
                    <div
                      style={{
                        display: "flex",
                        padding: "6px 8px",
                        gap: 4,
                        borderTop: "1px solid var(--cms-border)",
                      }}
                    >
                      <button
                        className="cms-btn cms-btn--ghost cms-btn--sm"
                        style={{ flex: 1, justifyContent: "center" }}
                        title="Copy URL"
                        onClick={() => handleCopy(item.url, item.id)}
                      >
                        {copied === item.id ? (
                          <Check size={12} style={{ color: "var(--cms-success)" }} />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                      <button
                        className="cms-btn cms-btn--ghost cms-btn--sm"
                        style={{ flex: 1, justifyContent: "center", color: "var(--cms-danger)" }}
                        title="Delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}

                  {selectMode && (
                    <div
                      style={{
                        padding: "6px 8px",
                        borderTop: "1px solid var(--cms-border)",
                        textAlign: "center",
                        fontSize: 11,
                        color: "var(--cms-primary)",
                        fontWeight: 600,
                      }}
                    >
                      Click to Insert
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="cms-modal__footer" style={{ marginTop: 16 }}>
          <span style={{ fontSize: 12, color: "var(--cms-text-muted)" }}>
            {filtered.length} of {items.length} file{items.length !== 1 ? "s" : ""}
          </span>
          {onClose && (
            <button className="cms-btn cms-btn--ghost" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaManager;
