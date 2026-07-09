import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search videos, trainers, topics…",
}) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 shadow-sm">
      <Search className="w-4 h-4 text-gray-400 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-sm text-[#1E293B] dark:text-white placeholder:text-gray-400 min-w-0"
      />
    </div>
  );
}
