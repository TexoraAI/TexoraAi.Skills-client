import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

/* -----------------------------------------------------------------------
 * Shared toast/notification system.
 * Every button across the 13 workspace pages that doesn't have a real
 * destination (no modal system, no backend) now calls showToast(...) so
 * clicking it always produces a visible, real result instead of doing
 * nothing. Purely additive — no existing state/logic/markup was removed.
 * ----------------------------------------------------------------------- */

const ToastContext = createContext(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div className="toast-item" key={t.id}>
            <CheckCircle2 size={16} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
