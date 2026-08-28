// import React, { useEffect, useRef, useState, useCallback } from "react";
// import { createPortal } from "react-dom";
// import { X } from "lucide-react";

// /* -----------------------------------------------------------------------
//  * WorkspaceModal — the single reusable panel shell used by every real
//  * Workspace form (EventForm, ScheduleForm, EmailComposer, ContactForm,
//  * MeetingSetup, JoinMeetingModal). Since every form across all 13
//  * Workspace tabs (Overview, Events, Instant Meeting, Calendar, Calendar
//  * Sync, Email, My Schedules, Shared With Me, Reminders, Contacts,
//  * Availability, Integrations, Workspace Settings) opens through this
//  * one shell via WorkspaceModalProvider, changing it here is enough to
//  * change how every one of those forms opens — no page file touched.
//  *
//  * Renders as an inline, right-docked slide-in panel (not a centered
//  * popup) with a drag handle on its left edge to resize its width.
//  * Same header/close-X, scrollable body and footer slot as before, so
//  * nothing about the forms themselves changes.
//  *
//  * The panel is portaled to document.body, so it sits above everything
//  * by default — including the host app's own top nav bar. To keep that
//  * nav bar fully visible and untouched (instead of the panel covering
//  * it), the panel measures the live top position of `.workspace-shell`
//  * (the Workspace's own root element, already rendered on the page
//  * whenever a form can be open) and starts exactly there instead of at
//  * the very top of the viewport.
//  * ----------------------------------------------------------------------- */

// const MIN_WIDTH = 380;
// const MAX_WIDTH_MARGIN = 96; // keep this much of the page visible on the left

// export default function WorkspaceModal({
//   title,
//   subtitle,
//   onClose,
//   children,
//   footer,
//   width = 640,
//   closeOnBackdrop = true,
// }) {
//   const scrimRef = useRef(null);
//   const panelRef = useRef(null);
//   const dragState = useRef(null);

//   const [panelWidth, setPanelWidth] = useState(width);
//   const [isDragging, setIsDragging] = useState(false);
//   const [topOffset, setTopOffset] = useState(0);

//   const clampWidth = useCallback((w) => {
//     const maxWidth = typeof window !== "undefined" ? window.innerWidth - MAX_WIDTH_MARGIN : w;
//     return Math.round(Math.min(Math.max(w, MIN_WIDTH), Math.max(MIN_WIDTH, maxWidth)));
//   }, []);

//   useEffect(() => {
//     setPanelWidth(clampWidth(width));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [width]);

//   // Sit below the host page's top nav bar instead of covering it.
//   useEffect(() => {
//     const computeOffset = () => {
//       const shell = document.querySelector(".workspace-shell");
//       setTopOffset(shell ? Math.max(0, Math.round(shell.getBoundingClientRect().top)) : 0);
//     };
//     computeOffset();
//     window.addEventListener("resize", computeOffset);
//     return () => window.removeEventListener("resize", computeOffset);
//   }, []);

//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", onKey);
//     const prevOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.removeEventListener("keydown", onKey);
//       document.body.style.overflow = prevOverflow;
//     };
//   }, [onClose]);

//   // Keep the panel within bounds if the viewport itself is resized.
//   useEffect(() => {
//     const onResize = () => setPanelWidth((w) => clampWidth(w));
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, [clampWidth]);

//   const handleBackdropMouseDown = (e) => {
//     if (closeOnBackdrop && e.target === scrimRef.current) onClose();
//   };

//   // ── Drag-to-resize (panel is docked right, so dragging left grows it) ──
//   const onHandlePointerDown = (e) => {
//     e.preventDefault();
//     dragState.current = { startX: e.clientX, startWidth: panelWidth };
//     setIsDragging(true);
//     document.body.style.userSelect = "none";
//     document.body.style.cursor = "ew-resize";
//     window.addEventListener("pointermove", onHandlePointerMove);
//     window.addEventListener("pointerup", onHandlePointerUp);
//   };

//   const onHandlePointerMove = (e) => {
//     if (!dragState.current) return;
//     const delta = dragState.current.startX - e.clientX;
//     setPanelWidth(clampWidth(dragState.current.startWidth + delta));
//   };

//   const onHandlePointerUp = () => {
//     dragState.current = null;
//     setIsDragging(false);
//     document.body.style.userSelect = "";
//     document.body.style.cursor = "";
//     window.removeEventListener("pointermove", onHandlePointerMove);
//     window.removeEventListener("pointerup", onHandlePointerUp);
//   };

//   useEffect(
//     () => () => {
//       window.removeEventListener("pointermove", onHandlePointerMove);
//       window.removeEventListener("pointerup", onHandlePointerUp);
//       document.body.style.userSelect = "";
//       document.body.style.cursor = "";
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   );

//   const resetWidth = () => setPanelWidth(clampWidth(width));

//   return createPortal(
//     <div
//       className="wm-scrim"
//       ref={scrimRef}
//       style={{ "--wm-top": `${topOffset}px` }}
//       onMouseDown={handleBackdropMouseDown}
//     >
//       <div
//         className={`wm-panel${isDragging ? " wm-panel--dragging" : ""}`}
//         ref={panelRef}
//         style={{ "--wm-width": `${panelWidth}px` }}
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="wm-modal-title"
//         onMouseDown={(e) => e.stopPropagation()}
//       >
//         <div
//           className="wm-resize-handle"
//           onPointerDown={onHandlePointerDown}
//           onDoubleClick={resetWidth}
//           role="separator"
//           aria-orientation="vertical"
//           aria-label="Drag to resize panel"
//           title="Drag to resize · double-click to reset"
//         >
//           <span className="wm-resize-grip" />
//         </div>

//         <div className="wm-header">
//           <div className="wm-header-text">
//             <h2 id="wm-modal-title">{title}</h2>
//             {subtitle && <p>{subtitle}</p>}
//           </div>
//           <button type="button" className="wm-close" onClick={onClose} aria-label="Close">
//             <X size={18} />
//           </button>
//         </div>
//         <div className="wm-body">{children}</div>
//         {footer && <div className="wm-footer">{footer}</div>}
//       </div>
//     </div>,
//     document.body
//   );
// }























import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/* -----------------------------------------------------------------------
 * WorkspaceModal — the single reusable panel shell used by every real
 * Workspace form (EventForm, ScheduleForm, EmailComposer, ContactForm,
 * MeetingSetup, JoinMeetingModal). Since every form across all 13
 * Workspace tabs (Overview, Events, Instant Meeting, Calendar, Calendar
 * Sync, Email, My Schedules, Shared With Me, Reminders, Contacts,
 * Availability, Integrations, Workspace Settings) opens through this
 * one shell via WorkspaceModalProvider, changing it here is enough to
 * change how every one of those forms opens — no page file touched.
 *
 * Renders as an inline, right-docked slide-in panel (not a centered
 * popup) with a drag handle on its left edge to resize its width.
 * Same header/close-X, scrollable body and footer slot as before, so
 * nothing about the forms themselves changes.
 *
 * The panel is portaled to document.body, so it sits above everything
 * by default — including the host app's own top nav bar. To keep that
 * nav bar fully visible and untouched (instead of the panel covering
 * it), the panel measures the live top position of `.workspace-shell`
 * (the Workspace's own root element, already rendered on the page
 * whenever a form can be open) and starts exactly there instead of at
 * the very top of the viewport.
 * ----------------------------------------------------------------------- */

const MIN_WIDTH = 380;
const MAX_WIDTH_MARGIN = 96; // keep this much of the page visible on the left

export default function WorkspaceModal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  width = 640,
  closeOnBackdrop = true,
}) {
  const scrimRef = useRef(null);
  const panelRef = useRef(null);
  const dragState = useRef(null);

  const [panelWidth, setPanelWidth] = useState(width);
  const [isDragging, setIsDragging] = useState(false);
  const [topOffset, setTopOffset] = useState(0);

  const clampWidth = useCallback((w) => {
    const maxWidth = typeof window !== "undefined" ? window.innerWidth - MAX_WIDTH_MARGIN : w;
    return Math.round(Math.min(Math.max(w, MIN_WIDTH), Math.max(MIN_WIDTH, maxWidth)));
  }, []);

  useEffect(() => {
    setPanelWidth(clampWidth(width));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  // Sit below the host page's top nav bar instead of covering it.
  useEffect(() => {
    const computeOffset = () => {
      const shell = document.querySelector(".workspace-shell");
      setTopOffset(shell ? Math.max(0, Math.round(shell.getBoundingClientRect().top)) : 0);
    };
    computeOffset();
    window.addEventListener("resize", computeOffset);
    return () => window.removeEventListener("resize", computeOffset);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Keep the panel within bounds if the viewport itself is resized.
  useEffect(() => {
    const onResize = () => setPanelWidth((w) => clampWidth(w));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampWidth]);

  const handleBackdropMouseDown = (e) => {
    if (closeOnBackdrop && e.target === scrimRef.current) onClose();
  };

  // ── Drag-to-resize (panel is docked right, so dragging left grows it) ──
  const onHandlePointerDown = (e) => {
    e.preventDefault();
    dragState.current = { startX: e.clientX, startWidth: panelWidth };
    setIsDragging(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
    window.addEventListener("pointermove", onHandlePointerMove);
    window.addEventListener("pointerup", onHandlePointerUp);
  };

  const onHandlePointerMove = (e) => {
    if (!dragState.current) return;
    const delta = dragState.current.startX - e.clientX;
    setPanelWidth(clampWidth(dragState.current.startWidth + delta));
  };

  const onHandlePointerUp = () => {
    dragState.current = null;
    setIsDragging(false);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    window.removeEventListener("pointermove", onHandlePointerMove);
    window.removeEventListener("pointerup", onHandlePointerUp);
  };

  useEffect(
    () => () => {
      window.removeEventListener("pointermove", onHandlePointerMove);
      window.removeEventListener("pointerup", onHandlePointerUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const resetWidth = () => setPanelWidth(clampWidth(width));

  return createPortal(
    <div
      className="wm-scrim"
      ref={scrimRef}
      style={{ "--wm-top": `${topOffset}px` }}
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className={`wm-panel${isDragging ? " wm-panel--dragging" : ""}`}
        ref={panelRef}
        style={{ "--wm-width": `${panelWidth}px` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wm-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className="wm-resize-handle"
          onPointerDown={onHandlePointerDown}
          onDoubleClick={resetWidth}
          role="separator"
          aria-orientation="vertical"
          aria-label="Drag to resize panel"
          title="Drag to resize · double-click to reset"
        >
          <span className="wm-resize-grip" />
        </div>

        <div className="wm-header">
          <div className="wm-header-text">
            <h2 id="wm-modal-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="wm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="wm-body">{children}</div>
        {footer && <div className="wm-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}