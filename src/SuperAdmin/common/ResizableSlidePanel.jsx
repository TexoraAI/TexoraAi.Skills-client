// components/common/ResizableSlidePanel.jsx
// CRM-style resizable right-side slide panel — Framer Motion + TailwindCSS
// No external modal libraries. No overlay. No click-outside-to-close.

import React, { useRef, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_WIDTH = 420;
const MIN_WIDTH = 360;
const MAX_WIDTH = 900;

/**
 * ResizableSlidePanel
 *
 * Props:
 *  open        {boolean}    — controls visibility
 *  onClose     {function}   — called when close button or Cancel is clicked
 *  title       {string}     — panel header title
 *  subtitle    {string}     — panel header subtitle
 *  onSubmit    {function}   — called when submit button is clicked
 *  submitLabel {string}     — label for submit button (default: "Save")
 *  submitIcon  {ReactNode}  — icon for submit button
 *  loading     {boolean}    — shows spinner on submit button
 *  children    {ReactNode}  — panel body content (form fields)
 *  avatar      {ReactNode}  — optional avatar/icon shown in header beside title
 */
const ResizableSlidePanel = ({
  open,
  onClose,
  title = "Panel",
  subtitle = "",
  onSubmit,
  submitLabel = "Save",
  submitIcon,
  loading = false,
  children,
  avatar,
}) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isMobile, setIsMobile] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(DEFAULT_WIDTH);
  const handleRef = useRef(null);
  const widthTipRef = useRef(null);

  // Detect mobile/tablet
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Drag resize ──────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    handleRef.current?.classList.add("dragging");
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [width]);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const delta = startX.current - e.clientX;
    const newW = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta));
    setWidth(newW);
    if (widthTipRef.current) widthTipRef.current.textContent = `${Math.round(newW)}px`;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    handleRef.current?.classList.remove("dragging");
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // ── Touch resize (mobile) ─────────────────────────────────────────────────
  const onTouchStart = useCallback((e) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    startWidth.current = width;
  }, [width]);

  const onTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    const delta = startX.current - e.touches[0].clientX;
    const newW = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta));
    setWidth(newW);
  }, []);

  const onTouchEnd = useCallback(() => { isDragging.current = false; }, []);

  const panelWidth = isMobile ? "100vw" : `${width}px`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="slide-panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 340, damping: 36, mass: 0.9 }}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            width: panelWidth,
            zIndex: 500,
            display: "flex",
            flexDirection: "column",
            maxWidth: "100vw",
          }}
          className="bg-[#0d0d1c] border-l border-white/[0.08] shadow-[-12px_0_48px_rgba(0,0,0,0.5)]"
        >
          {/* ── Drag Handle (desktop only) ── */}
          {!isMobile && (
            <div
              ref={handleRef}
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              title="Drag to resize"
              className="
                group absolute left-0 top-0 w-[6px] h-full z-10
                cursor-col-resize flex items-center justify-center
                hover:bg-violet-500/10 transition-colors duration-200
                [&.dragging]:bg-violet-500/15
              "
            >
              {/* Visual pill */}
              <div className="
                w-[2px] h-10 rounded-full bg-white/10
                group-hover:bg-violet-400/60 group-hover:h-16
                transition-all duration-200 [.dragging_&]:bg-violet-400 [.dragging_&]:h-16
              " />
              {/* Width tooltip */}
              <span
                ref={widthTipRef}
                className="
                  absolute left-4 bg-violet-600 text-white text-[10px] font-bold
                  px-2 py-0.5 rounded whitespace-nowrap opacity-0
                  pointer-events-none [.dragging_&]:opacity-100 transition-opacity
                "
              >
                {width}px
              </span>
            </div>
          )}

          {/* ── Sticky Header ── */}
          <div className="
            flex-shrink-0 flex items-center justify-between
            px-6 py-4 border-b border-white/[0.07]
            bg-[#0d0d1c]
          ">
            <div className="flex items-center gap-3 min-w-0">
              {avatar && (
                <div className="flex-shrink-0">{avatar}</div>
              )}
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold text-white tracking-tight truncate leading-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-[11px] text-white/35 font-normal mt-0.5 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close panel"
              className="
                flex-shrink-0 ml-3 w-8 h-8 flex items-center justify-center
                rounded-lg border border-white/10 text-white/40
                hover:bg-white/[0.06] hover:text-white hover:border-white/20
                transition-all duration-150
              "
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Scrollable Body ── */}
          <div className="
            flex-1 overflow-y-auto px-6 py-5
            scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
          ">
            {children}
          </div>

          {/* ── Sticky Footer ── */}
          <div className="
            flex-shrink-0 flex items-center justify-end gap-3
            px-6 py-4 border-t border-white/[0.07]
            bg-[#0d0d1c]/90 backdrop-blur-sm
          ">
            <button
              onClick={onClose}
              className="
                px-5 py-2 rounded-lg border border-white/10
                text-white/45 text-[13px] font-medium
                hover:bg-white/[0.05] hover:text-white/80 hover:border-white/20
                transition-all duration-150
              "
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="
                flex items-center gap-2 px-6 py-2 rounded-lg
                bg-violet-600 hover:bg-violet-700 active:scale-[0.98]
                text-white text-[13px] font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                transition-all duration-150
              "
            >
              {loading ? (
                <>
                  <Spinner />
                  Saving…
                </>
              ) : (
                <>
                  {submitIcon}
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = () => (
  <svg
    className="animate-spin"
    width={14} height={14} viewBox="0 0 24 24" fill="none"
  >
    <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={3} />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
  </svg>
);

// ── Status Dot ────────────────────────────────────────────────────────────────
export const StatusDot = ({ status }) => {
  const colors = {
    active:    "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]",
    inactive:  "bg-slate-500",
    suspended: "bg-red-500",
    pending:   "bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]",
  };
  return (
    <span className={`inline-block w-[7px] h-[7px] rounded-full mr-1.5 flex-shrink-0 ${colors[status] || "bg-slate-500"}`} />
  );
};

// ── Section Label ─────────────────────────────────────────────────────────────
export const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-white/28 mb-3 mt-1">
    {children}
  </p>
);

// ── Divider ───────────────────────────────────────────────────────────────────
export const PanelDivider = () => (
  <div className="h-px bg-white/[0.07] my-5" />
);

// ── Field Wrapper ─────────────────────────────────────────────────────────────
export const Field = ({ label, error, children }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-[11px] font-medium text-white/40 uppercase tracking-[0.07em] mb-1.5">
        {label}
      </label>
    )}
    {children}
    {error && (
      <p className="flex items-center gap-1 mt-1.5 text-[11px] text-red-400">
        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <circle cx={12} cy={12} r={10}/><path d="M12 8v4M12 16h.01"/>
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ── Input ─────────────────────────────────────────────────────────────────────
export const PanelInput = ({ error, ...props }) => (
  <input
    {...props}
    className={`
      w-full px-3.5 py-2.5 rounded-lg text-[13.5px] text-white
      bg-white/[0.04] border outline-none font-[DM_Sans,sans-serif]
      placeholder:text-white/20
      focus:bg-violet-500/5 transition-all duration-150
      ${error
        ? "border-red-500/40 bg-red-500/[0.04]"
        : "border-white/10 focus:border-violet-500/50"
      }
    `}
  />
);

// ── Select ────────────────────────────────────────────────────────────────────
export const PanelSelect = ({ error, children, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className={`
        w-full px-3.5 py-2.5 rounded-lg text-[13.5px] text-white
        bg-white/[0.04] border outline-none appearance-none cursor-pointer
        focus:bg-violet-500/5 transition-all duration-150
        ${error
          ? "border-red-500/40 bg-red-500/[0.04]"
          : "border-white/10 focus:border-violet-500/50"
        }
      `}
    >
      {children}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2.5}>
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </div>
);

// ── Role Pills ────────────────────────────────────────────────────────────────
export const RolePills = ({ value, onChange, roles }) => {
  const styles = {
    student: { active: "bg-violet-500/15 border-violet-500/50 text-violet-300" },
    trainer: { active: "bg-emerald-500/12 border-emerald-500/40 text-emerald-300" },
    admin:   { active: "bg-red-500/12 border-red-500/35 text-red-300" },
  };
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {roles.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`
            px-4 py-1.5 rounded-full border text-[12px] font-medium
            transition-all duration-150 cursor-pointer
            ${value === r
              ? (styles[r]?.active || "bg-violet-500/15 border-violet-500/50 text-violet-300")
              : "border-white/10 text-white/45 hover:border-white/25 hover:text-white/75"
            }
          `}
        >
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ResizableSlidePanel;