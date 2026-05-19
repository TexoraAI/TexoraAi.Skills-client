import React from "react";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger", // 'danger' | 'warning' | 'info'
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const colors = {
    danger: { btn: "bg-red-500 hover:bg-red-600", icon: "text-red-400", bg: "bg-red-500/10" },
    warning: { btn: "bg-amber-500 hover:bg-amber-600", icon: "text-amber-400", bg: "bg-amber-500/10" },
    info: { btn: "bg-violet-500 hover:bg-violet-600", icon: "text-violet-400", bg: "bg-violet-500/10" },
  };
  const c = colors[variant];

  const icons = {
    danger: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
    warning: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[#13131f] border border-white/10 rounded-2xl shadow-2xl p-6">
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mx-auto mb-4`}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={c.icon}>
            <path d={icons[variant]} />
          </svg>
        </div>
        <h3 className="text-white font-semibold text-center mb-2">{title}</h3>
        {message && <p className="text-slate-400 text-sm text-center mb-6">{message}</p>}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/8 rounded-lg transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all ${c.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;