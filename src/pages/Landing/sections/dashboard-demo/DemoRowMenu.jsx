import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

// Small reusable "..." row action menu — reuses the .row-menu-wrap /
// .row-menu-btn / .row-menu-dropdown classes already defined in
// dashboardDemo.styles.js but not yet used by any demo page.
export default function DemoRowMenu({ actions }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className="row-menu-wrap" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="row-menu-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="More actions"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="row-menu-dropdown">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => {
                setOpen(false);
                a.onClick();
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
