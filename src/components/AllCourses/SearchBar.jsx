import { Search, X } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   SEARCH BAR — filters courses by name, category, and description.
   Controlled component: value/onChange are owned by AllCourses.jsx
   so the same query can drive filtering across every section.
───────────────────────────────────────────────────────────────── */
export default function SearchBar({ value, onChange, theme, className = "" }) {
  const isDark = theme === "dark";

  return (
    <div className={`relative w-full ${className}`}>
      <Search
        size={18}
        className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search courses..."
        aria-label="Search courses"
        className={`w-full h-11 pl-10 pr-10 rounded-xl text-sm font-medium outline-none transition-all duration-200 border ${
          isDark
            ? "bg-[#232323] border-white/[0.08] text-white placeholder-gray-500 focus:border-[#F97316]"
            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#F97316] shadow-sm"
        } focus:ring-2 focus:ring-[#F97316]/20`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full transition-colors ${
            isDark
              ? "text-gray-500 hover:text-white hover:bg-white/10"
              : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
