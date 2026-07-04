import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './Icons.jsx';

/**
 * BannerSidePanel
 * ----------------
 * Replaces the old CreateBannerModal popup. Renders as a collapsible panel
 * docked to the left of the banner workspace (desktop/laptop/tablet-landscape)
 * or as a full-screen drawer (phones + tablet-portrait). Contains exactly the
 * same form fields / business logic that used to live in the modal — only
 * the container changed.
 */

const MIN_WIDTH = 320;
const DEFAULT_WIDTH = 420;
const MAX_WIDTH = 650;

const EMPTY_FORM = {
  name: '',
  ctaText: '',
  ctaLink: '',
  startDate: '',
  endDate: '',
  active: false,
  emoji: '🎯',
  gradient: 'linear-gradient(135deg,#F97316,#16A34A)',
};

const EMPTY_ASSETS = { desktop: null, tablet: null, mobile: null };

const DEVICE_SPECS = [
  { key: 'desktop', icon: <Icon.Monitor size={20} />, label: 'Desktop', dims: '1920×600' },
  { key: 'tablet', icon: <Icon.Tablet size={20} />, label: 'Tablet', dims: '1024×500' },
  { key: 'mobile', icon: <Icon.Mobile size={20} />, label: 'Mobile', dims: '640×800' },
];

const OPTIONS = [
  { key: 'upload', icon: <Icon.Upload size={19} />, tone: 'upload', title: 'Upload Banner', sub: 'Use your own artwork' },
  { key: 'design', icon: <Icon.Palette size={19} />, tone: 'design', title: 'Design Banner', sub: 'Build it in the studio' },
  { key: 'ai', icon: <Icon.Sparkles size={19} />, tone: 'ai', title: 'Generate with AI', sub: 'Describe, then generate' },
];

// Drawer mode = full-screen overlay: phones, and tablets in portrait
// orientation. Anything wider that's in landscape gets the split layout.
function getIsDrawerMode() {
  if (typeof window === 'undefined') return false;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return w < 768 || (w <= 1024 && h > w);
}

function useIsDrawerMode() {
  const [isDrawer, setIsDrawer] = useState(getIsDrawerMode);
  useEffect(() => {
    const onResize = () => setIsDrawer(getIsDrawerMode());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
  return isDrawer;
}

export default function BannerSidePanel({ isOpen, onClose, onSave, editingBanner, showToast }) {
  const [opt, setOpt] = useState('upload');
  const [form, setForm] = useState(EMPTY_FORM);
  const [assets, setAssets] = useState(EMPTY_ASSETS);
  const [nameTouched, setNameTouched] = useState(false);

  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, startWidth: DEFAULT_WIDTH });

  const isDrawer = useIsDrawerMode();

  useEffect(() => {
    if (editingBanner) {
      setForm({
        name: editingBanner.name || '',
        ctaText: editingBanner.ctaText || '',
        ctaLink: editingBanner.ctaLink || '',
        startDate: editingBanner.startDate || '',
        endDate: editingBanner.endDate || '',
        active: editingBanner.active || false,
        emoji: editingBanner.emoji || '🎯',
        gradient: editingBanner.gradient || EMPTY_FORM.gradient,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setAssets(EMPTY_ASSETS);
    setOpt('upload');
    setNameTouched(false);
  }, [editingBanner, isOpen]);

  // Lock background scroll only for the full-screen mobile/tablet-portrait drawer.
  useEffect(() => {
    if (isDrawer && isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [isDrawer, isOpen]);

  const update = useCallback((field, value) => setForm((prev) => ({ ...prev, [field]: value })), []);

  const handleFile = useCallback((device, file) => {
    if (!file) return;
    setAssets((prev) => ({ ...prev, [device]: { file, previewUrl: URL.createObjectURL(file) } }));
  }, []);

  const submit = useCallback(
    (status) => {
      if (!form.name.trim()) {
        setNameTouched(true);
        return;
      }
      onSave({ ...form, status, active: status === 'active' ? true : form.active });
    },
    [form, onSave]
  );

  const notImplemented = useCallback(
    (label) => {
      if (showToast) showToast(`${label} — coming soon`, 'info');
    },
    [showToast]
  );

  // ---- Drag-to-resize (mouse, touch & pen via Pointer Events) ----
  // The panel is docked to the right, so the handle sits on its left edge:
  // dragging left grows the panel, dragging right shrinks it.
  const handlePointerMove = useCallback((e) => {
    const delta = dragState.current.startX - e.clientX;
    const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragState.current.startWidth + delta));
    setPanelWidth(next);
  }, []);

  const handlePointerUp = useCallback(
    (e) => {
      setIsDragging(false);
      document.body.classList.remove('bs-resizing');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (e.target && e.target.releasePointerCapture && e.pointerId != null) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch (_) {
          /* no-op */
        }
      }
    },
    [handlePointerMove]
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (isDrawer) return;
      dragState.current = { startX: e.clientX, startWidth: panelWidth };
      setIsDragging(true);
      document.body.classList.add('bs-resizing');
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [isDrawer, panelWidth, handlePointerMove, handlePointerUp]
  );

  useEffect(
    () => () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.classList.remove('bs-resizing');
    },
    [handlePointerMove, handlePointerUp]
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
    'bs-side-panel-wrapper',
    isDrawer ? 'bs-panel-drawer' : '',
    isOpen ? 'bs-panel-open' : '',
    isDragging ? 'bs-panel-dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass} style={wrapperStyle} aria-hidden={!isOpen}>
      <div className="bs-side-panel" style={panelStyle}>
        <div className="bs-panel-head">
          <h3>{editingBanner ? 'Edit banner' : 'Create a new banner'}</h3>
          <button className="bs-panel-close" onClick={onClose} aria-label="Close panel" type="button">
            {isDrawer ? <Icon.X size={17} /> : <Icon.ChevronRight size={17} />}
          </button>
        </div>

        <div className="bs-panel-body">
          {/* Mode selector */}
          <div className="option-grid">
            {OPTIONS.map((o) => (
              <div
                key={o.key}
                className={`option-card${opt === o.key ? ' active' : ''}`}
                onClick={() => setOpt(o.key)}
              >
                <div className={`opt-icon opt-icon-${o.tone}`}>{o.icon}</div>
                <strong>{o.title}</strong>
                <span>{o.sub}</span>
              </div>
            ))}
          </div>

          {/* Upload panel */}
          {opt === 'upload' && (
            <>
              <div className="field">
                <label>Banner Name</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Mega Sale – 40% Off Courses"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  onBlur={() => setNameTouched(true)}
                  required
                />
                {nameTouched && !form.name.trim() && (
                  <span style={{ color: '#DC2626', fontSize: '11.5px', marginTop: '5px', display: 'block' }}>
                    Please fill out this field.
                  </span>
                )}
              </div>

              <div className="upload-grid">
                {DEVICE_SPECS.map((d) => (
                  <label className="dropzone" key={d.key}>
                    {assets[d.key] ? (
                      <>
                        <img src={assets[d.key].previewUrl} alt={d.label} />
                        <span className="dz-check">
                          <Icon.Check size={12} />
                        </span>
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
                      onChange={(e) => handleFile(d.key, e.target.files && e.target.files[0])}
                    />
                  </label>
                ))}
              </div>

              <div className="form-grid">
                <div className="field">
                  <label>CTA Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Enroll Now"
                    value={form.ctaText}
                    onChange={(e) => update('ctaText', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>CTA Link</label>
                  <input
                    type="url"
                    placeholder="https://ilmora.com/courses/..."
                    value={form.ctaLink}
                    onChange={(e) => update('ctaLink', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => update('startDate', e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => update('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="toggle-row">
                <div>
                  <strong>Active</strong>
                  <span>Make this banner live immediately after saving</span>
                </div>
                <div
                  className={`switch${form.active ? ' on' : ''}`}
                  role="switch"
                  aria-checked={form.active}
                  tabIndex={0}
                  onClick={() => update('active', !form.active)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      update('active', !form.active);
                    }
                  }}
                />
              </div>

              <div className="bs-panel-foot">
                <button type="button" className="btn btn-ghost" onClick={onClose}>
                  Cancel
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => submit('draft')}>
                  Save Draft
                </button>
                <button type="button" className="btn btn-primary" onClick={() => submit('active')}>
                  <Icon.Send size={15} /> Publish
                </button>
              </div>
            </>
          )}

          {/* Design panel */}
          {opt === 'design' && (
            <div className="bs-placeholder-panel">
              <div className="empty-icon" style={{ background: 'var(--orange-50)', color: 'var(--orange-700)' }}>
                <Icon.Palette size={26} />
              </div>
              <h3>Open the drag &amp; drop builder</h3>
              <p>Design backgrounds, text, buttons and shapes visually, then publish straight from the canvas.</p>
              <button className="btn btn-primary" onClick={() => notImplemented('Banner Builder')}>
                <Icon.Palette size={15} /> Open Banner Builder
              </button>
            </div>
          )}

          {/* AI panel */}
          {opt === 'ai' && (
            <div className="bs-placeholder-panel">
              <div className="empty-icon" style={{ background: 'var(--green-50)', color: 'var(--green-700)' }}>
                <Icon.Sparkles size={26} />
              </div>
              <h3>Let AI draft it for you</h3>
              <p>Describe the audience, theme and goal — ILM ORA's AI engine writes the headline, subtext and CTA.</p>
              <button className="btn btn-green" onClick={() => notImplemented('AI Generator')}>
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
