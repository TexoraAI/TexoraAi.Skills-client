export default function ToggleSwitch({ label, checked, onChange, hint, icon }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border transition-all text-left
        ${checked ? "border-indigo-300 bg-indigo-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
    >
      <span className="flex items-center gap-2 min-w-0">
        {icon && <span className="text-base flex-shrink-0">{icon}</span>}
        <span className="min-w-0">
          <span className={`block text-sm font-semibold truncate ${checked ? "text-indigo-700" : "text-gray-700"}`}>{label}</span>
          {hint && <span className="block text-xs text-gray-400 truncate">{hint}</span>}
        </span>
      </span>
      <span
        className={`relative flex-shrink-0 w-9 h-5 rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : ""}`}
        />
      </span>
    </button>
  );
}
