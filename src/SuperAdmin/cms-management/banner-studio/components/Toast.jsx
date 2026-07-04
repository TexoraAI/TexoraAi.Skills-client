import React, { useEffect, useState } from 'react';
import { Icon } from './Icons.jsx';

export function ToastStack({ toasts, removeToast }) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDone={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 3200);
    const t2 = setTimeout(onDone, 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={`toast ${toast.type} ${leaving ? 'leaving' : ''}`}>
      <span className="toast-icon">
        {toast.type === 'success' ? <Icon.Check size={13} /> : <Icon.Info size={13} />}
      </span>
      <span>{toast.message}</span>
    </div>
  );
}

// Simple hook-based toast manager to be used from App.jsx
export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
}
