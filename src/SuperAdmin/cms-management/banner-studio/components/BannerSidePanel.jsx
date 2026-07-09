import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icon } from "./Icons.jsx";

/**
 * BannerSidePanel
 * ----------------
 * Renders as a collapsible panel docked to the left of the banner workspace
 * (desktop/laptop/tablet-landscape) or as a full-screen drawer (phones +
 * tablet-portrait). Contains the banner create/edit form.
 *
 * IMAGE UPLOAD FIX (this version):
 * Previously, files picked in the device dropzones were only used to build a
 * local `URL.createObjectURL()` preview and were never actually sent to the
 * backend — `submit()` only forwarded the text fields. The backend entity
 * (`BannerStudio`) stores images as base64 data URLs in TEXT columns
 * (desktopImageUrl / tabletImageUrl / mobileImageUrl), so this version:
 *   1. Converts each picked File to a base64 data URL via FileReader as soon
 *      as it's selected (`fileToBase64`).
 *   2. Tracks per-device converting/error state so the user gets feedback
 *      and can't submit mid-conversion.
 *   3. When editing an existing banner, seeds `assets` from the banner's
 *      existing *ImageUrl fields so already-uploaded images show as
 *      previews and are preserved if the user doesn't replace them.
 *   4. Includes `desktopImageUrl` / `tabletImageUrl` / `mobileImageUrl` in
 *      the payload passed to `onSave`.
 *   5. Lets the user remove a picked/existing image before saving.
 */

const MIN_WIDTH = 320;
const DEFAULT_WIDTH = 420;
const MAX_WIDTH = 650;

// Keep base64 payloads reasonable — a raw file above this gets rejected
// with a toast rather than silently bloating the request / DB row.
const MAX_IMAGE_MB = 5;

const EMPTY_FORM = {
  name: "",
  ctaText: "",
  ctaLink: "",
  startDate: "",
  endDate: "",
  active: false,
  emoji: "🎯",
  gradient: "linear-gradient(135deg,#F97316,#16A34A)",
};

const EMPTY_ASSETS = { desktop: null, tablet: null, mobile: null };

const DEVICE_SPECS = [
  {
    key: "desktop",
    icon: <Icon.Monitor size={20} />,
    label: "Desktop",
    dims: "1920×600",
  },
  {
    key: "tablet",
    icon: <Icon.Tablet size={20} />,
    label: "Tablet",
    dims: "1024×500",
  },
  {
    key: "mobile",
    icon: <Icon.Mobile size={20} />,
    label: "Mobile",
    dims: "640×800",
  },
];

// Maps each device key to the response/request field the backend expects.
const DEVICE_FIELD_MAP = {
  desktop: "desktopImageUrl",
  tablet: "tabletImageUrl",
  mobile: "mobileImageUrl",
};

const OPTIONS = [
  {
    key: "upload",
    icon: <Icon.Upload size={19} />,
    tone: "upload",
    title: "Upload Banner",
    sub: "Use your own artwork",
  },
  {
    key: "design",
    icon: <Icon.Palette size={19} />,
    tone: "design",
    title: "Design Banner",
    sub: "Build it in the studio",
  },
  {
    key: "ai",
    icon: <Icon.Sparkles size={19} />,
    tone: "ai",
    title: "Generate with AI",
    sub: "Describe, then generate",
  },
];

// Drawer mode = full-screen overlay: phones, and tablets in portrait
// orientation. Anything wider that's in landscape gets the split layout.
function getIsDrawerMode() {
  if (typeof window === "undefined") return false;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return w < 768 || (w <= 1024 && h > w);
}

function useIsDrawerMode() {
  const [isDrawer, setIsDrawer] = useState(getIsDrawerMode);
  useEffect(() => {
    const onResize = () => setIsDrawer(getIsDrawerMode());
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
  return isDrawer;
}

// Reads a File and resolves with its base64 data URL
// (e.g. "data:image/png;base64,iVBORw0KG...").
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(reader.error || new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function BannerSidePanel({
  isOpen,
  onClose,
  onSave,
  editingBanner,
  showToast,
}) {
  const [opt, setOpt] = useState("upload");
  const [form, setForm] = useState(EMPTY_FORM);
  // assets[device] shape while in use:
  //   { previewUrl, base64, converting, isExisting, name, error }
  const [assets, setAssets] = useState(EMPTY_ASSETS);
  const [nameTouched, setNameTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, startWidth: DEFAULT_WIDTH });

  // Tracks blob: URLs we created via URL.createObjectURL so we can revoke
  // them on cleanup and avoid leaking memory across open/close cycles.
  const objectUrlsRef = useRef(new Set());

  const isDrawer = useIsDrawerMode();

  const revokeTrackedUrls = useCallback(() => {
    objectUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (_) {
        /* no-op */
      }
    });
    objectUrlsRef.current.clear();
  }, []);

  useEffect(() => {
    if (editingBanner) {
      setForm({
        name: editingBanner.name || "",
        ctaText: editingBanner.ctaText || "",
        ctaLink: editingBanner.ctaLink || "",
        startDate: editingBanner.startDate || "",
        endDate: editingBanner.endDate || "",
        active: editingBanner.active || false,
        emoji: editingBanner.emoji || "🎯",
        gradient: editingBanner.gradient || EMPTY_FORM.gradient,
      });

      // Seed assets from whatever images this banner already has saved, so
      // the dropzones show them as already-uploaded and they get preserved
      // on save unless the user replaces or removes them.
      revokeTrackedUrls();
      const seeded = { desktop: null, tablet: null, mobile: null };
      Object.entries(DEVICE_FIELD_MAP).forEach(([deviceKey, field]) => {
        const existingUrl = editingBanner[field];
        if (existingUrl) {
          seeded[deviceKey] = {
            previewUrl: existingUrl,
            base64: existingUrl,
            converting: false,
            isExisting: true,
            name: null,
            error: null,
          };
        }
      });
      setAssets(seeded);
    } else {
      setForm(EMPTY_FORM);
      revokeTrackedUrls();
      setAssets(EMPTY_ASSETS);
    }
    setOpt("upload");
    setNameTouched(false);
    setSaving(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingBanner, isOpen]);

  // Revoke any outstanding blob URLs when the panel unmounts entirely.
  useEffect(() => () => revokeTrackedUrls(), [revokeTrackedUrls]);

  // Lock background scroll only for the full-screen mobile/tablet-portrait drawer.
  useEffect(() => {
    if (isDrawer && isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [isDrawer, isOpen]);

  const update = useCallback(
    (field, value) => setForm((prev) => ({ ...prev, [field]: value })),
    [],
  );

  const handleFile = useCallback(
    (device, file) => {
      if (!file) return;

      if (!file.type || !file.type.startsWith("image/")) {
        if (showToast) showToast("Please choose an image file", "info");
        return;
      }

      const maxBytes = MAX_IMAGE_MB * 1024 * 1024;
      if (file.size > maxBytes) {
        if (showToast)
          showToast(`Image is too large — max ${MAX_IMAGE_MB}MB`, "info");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      objectUrlsRef.current.add(previewUrl);

      setAssets((prev) => ({
        ...prev,
        [device]: {
          previewUrl,
          base64: null,
          converting: true,
          isExisting: false,
          name: file.name,
          error: null,
        },
      }));

      fileToBase64(file)
        .then((base64) => {
          setAssets((prev) => {
            // Bail if the user picked a different file for this device
            // while the conversion was in flight.
            if (!prev[device] || prev[device].previewUrl !== previewUrl)
              return prev;
            return {
              ...prev,
              [device]: { ...prev[device], base64, converting: false },
            };
          });
        })
        .catch((err) => {
          console.error("Failed to read image file", err);
          setAssets((prev) => {
            if (!prev[device] || prev[device].previewUrl !== previewUrl)
              return prev;
            return {
              ...prev,
              [device]: {
                ...prev[device],
                converting: false,
                error: "Failed to read file",
              },
            };
          });
          if (showToast) showToast("Failed to read image file", "info");
        });
    },
    [showToast],
  );

  const removeAsset = useCallback((device, e) => {
    if (e) e.preventDefault();
    setAssets((prev) => {
      const current = prev[device];
      if (
        current &&
        current.previewUrl &&
        current.previewUrl.startsWith("blob:")
      ) {
        try {
          URL.revokeObjectURL(current.previewUrl);
        } catch (_) {
          /* no-op */
        }
        objectUrlsRef.current.delete(current.previewUrl);
      }
      return { ...prev, [device]: null };
    });
  }, []);

  const isConverting =
    assets.desktop?.converting ||
    assets.tablet?.converting ||
    assets.mobile?.converting;

  const submit = useCallback(
    (status) => {
      if (!form.name.trim()) {
        setNameTouched(true);
        return;
      }

      if (isConverting) {
        if (showToast)
          showToast("Still processing an image — one sec…", "info");
        return;
      }

      const imageFields = {};
      Object.entries(DEVICE_FIELD_MAP).forEach(([deviceKey, field]) => {
        const asset = assets[deviceKey];
        imageFields[field] = asset && !asset.error ? asset.base64 : null;
      });

      setSaving(true);
      Promise.resolve(
        onSave({
          ...form,
          ...imageFields,
          status,
          active: status === "active" ? true : form.active,
        }),
      ).finally(() => setSaving(false));
    },
    [form, assets, isConverting, onSave, showToast],
  );

  const notImplemented = useCallback(
    (label) => {
      if (showToast) showToast(`${label} — coming soon`, "info");
    },
    [showToast],
  );

  // ---- Drag-to-resize (mouse, touch & pen via Pointer Events) ----
  // The panel is docked to the right, so the handle sits on its left edge:
  // dragging left grows the panel, dragging right shrinks it.
  const handlePointerMove = useCallback((e) => {
    const delta = dragState.current.startX - e.clientX;
    const next = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, dragState.current.startWidth + delta),
    );
    setPanelWidth(next);
  }, []);

  const handlePointerUp = useCallback(
    (e) => {
      setIsDragging(false);
      document.body.classList.remove("bs-resizing");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (e.target && e.target.releasePointerCapture && e.pointerId != null) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch (_) {
          /* no-op */
        }
      }
    },
    [handlePointerMove],
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (isDrawer) return;
      dragState.current = { startX: e.clientX, startWidth: panelWidth };
      setIsDragging(true);
      document.body.classList.add("bs-resizing");
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [isDrawer, panelWidth, handlePointerMove, handlePointerUp],
  );

  useEffect(
    () => () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.classList.remove("bs-resizing");
    },
    [handlePointerMove, handlePointerUp],
  );

  const wrapperStyle = useMemo(() => {
    if (isDrawer) return undefined;
    return {
      width: isOpen ? panelWidth : 0,
      marginLeft: isOpen ? 20 : 0,
    };
  }, [isDrawer, isOpen, panelWidth]);

  const panelStyle = useMemo(() => {
    if (isDrawer) return undefined;
    return { width: panelWidth };
  }, [isDrawer, panelWidth]);

  const wrapperClass = [
    "bs-side-panel-wrapper",
    isDrawer ? "bs-panel-drawer" : "",
    isOpen ? "bs-panel-open" : "",
    isDragging ? "bs-panel-dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass} style={wrapperStyle} aria-hidden={!isOpen}>
      <div className="bs-side-panel" style={panelStyle}>
        <div className="bs-panel-head">
          <h3>{editingBanner ? "Edit banner" : "Create a new banner"}</h3>
          <button
            className="bs-panel-close"
            onClick={onClose}
            aria-label="Close panel"
            type="button"
          >
            {isDrawer ? <Icon.X size={17} /> : <Icon.ChevronRight size={17} />}
          </button>
        </div>

        <div className="bs-panel-body">
          {/* Mode selector */}
          <div className="option-grid">
            {OPTIONS.map((o) => (
              <div
                key={o.key}
                className={`option-card${opt === o.key ? " active" : ""}`}
                onClick={() => setOpt(o.key)}
              >
                <div className={`opt-icon opt-icon-${o.tone}`}>{o.icon}</div>
                <strong>{o.title}</strong>
                <span>{o.sub}</span>
              </div>
            ))}
          </div>

          {/* Upload panel */}
          {opt === "upload" && (
            <>
              <div className="field">
                <label>Banner Name</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Mega Sale – 40% Off Courses"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => setNameTouched(true)}
                  required
                />
                {nameTouched && !form.name.trim() && (
                  <span
                    style={{
                      color: "#DC2626",
                      fontSize: "11.5px",
                      marginTop: "5px",
                      display: "block",
                    }}
                  >
                    Please fill out this field.
                  </span>
                )}
              </div>

              <div className="upload-grid">
                {DEVICE_SPECS.map((d) => {
                  const asset = assets[d.key];
                  return (
                    <label className="dropzone" key={d.key}>
                      {asset ? (
                        <>
                          <img src={asset.previewUrl} alt={d.label} />

                          {asset.converting && (
                            <span
                              style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(15,23,42,0.55)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 2,
                              }}
                            >
                              <span className="bs-spinner" />
                            </span>
                          )}

                          {!asset.converting && !asset.error && (
                            <span className="dz-check">
                              <Icon.Check size={12} />
                            </span>
                          )}

                          {asset.error && (
                            <span
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: "rgba(220,38,38,0.85)",
                                color: "#fff",
                                fontSize: "9.5px",
                                fontWeight: 700,
                                padding: "3px 4px",
                                zIndex: 2,
                                textAlign: "center",
                              }}
                            >
                              {asset.error}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => removeAsset(d.key, e)}
                            aria-label={`Remove ${d.label} image`}
                            title="Remove image"
                            style={{
                              position: "absolute",
                              top: 6,
                              left: 6,
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: "rgba(15,23,42,0.75)",
                              color: "#fff",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              zIndex: 3,
                              padding: 0,
                            }}
                          >
                            <Icon.X size={11} />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="dz-icon">{d.icon}</div>
                          <span>{d.label}</span>
                          <small>{d.dims}</small>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFile(d.key, e.target.files && e.target.files[0])
                        }
                      />
                    </label>
                  );
                })}
              </div>

              <div className="form-grid">
                <div className="field">
                  <label>CTA Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Enroll Now"
                    value={form.ctaText}
                    onChange={(e) => update("ctaText", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>CTA Link</label>
                  <input
                    type="url"
                    placeholder="https://ilmora.com/courses/..."
                    value={form.ctaLink}
                    onChange={(e) => update("ctaLink", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => update("endDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="toggle-row">
                <div>
                  <strong>Active</strong>
                  <span>Make this banner live immediately after saving</span>
                </div>
                <div
                  className={`switch${form.active ? " on" : ""}`}
                  role="switch"
                  aria-checked={form.active}
                  tabIndex={0}
                  onClick={() => update("active", !form.active)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      update("active", !form.active);
                    }
                  }}
                />
              </div>

              <div className="bs-panel-foot">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => submit("draft")}
                  disabled={saving || isConverting}
                >
                  {saving ? <span className="bs-spinner" /> : "Save Draft"}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => submit("active")}
                  disabled={saving || isConverting}
                >
                  {saving ? (
                    <span className="bs-spinner" />
                  ) : (
                    <>
                      <Icon.Send size={15} /> Publish
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Design panel */}
          {opt === "design" && (
            <div className="bs-placeholder-panel">
              <div
                className="empty-icon"
                style={{
                  background: "var(--orange-50)",
                  color: "var(--orange-700)",
                }}
              >
                <Icon.Palette size={26} />
              </div>
              <h3>Open the drag &amp; drop builder</h3>
              <p>
                Design backgrounds, text, buttons and shapes visually, then
                publish straight from the canvas.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => notImplemented("Banner Builder")}
              >
                <Icon.Palette size={15} /> Open Banner Builder
              </button>
            </div>
          )}

          {/* AI panel */}
          {opt === "ai" && (
            <div className="bs-placeholder-panel">
              <div
                className="empty-icon"
                style={{
                  background: "var(--green-50)",
                  color: "var(--green-700)",
                }}
              >
                <Icon.Sparkles size={26} />
              </div>
              <h3>Let AI draft it for you</h3>
              <p>
                Describe the audience, theme and goal — ILM ORA's AI engine
                writes the headline, subtext and CTA.
              </p>
              <button
                className="btn btn-green"
                onClick={() => notImplemented("AI Generator")}
              >
                <Icon.Sparkles size={15} /> Open AI Generator
              </button>
            </div>
          )}
        </div>
      </div>

      {!isDrawer && (
        <div
          className="bs-resize-handle"
          onPointerDown={handlePointerDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panel"
          aria-valuenow={panelWidth}
          aria-valuemin={MIN_WIDTH}
          aria-valuemax={MAX_WIDTH}
        />
      )}
    </div>
  );
}
