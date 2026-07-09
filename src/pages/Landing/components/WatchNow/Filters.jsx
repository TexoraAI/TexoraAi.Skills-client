import SearchBar from "./SearchBar";
import { watchNowCategories } from "./data";

const DURATIONS = [
  { value: "", label: "Any duration" },
  { value: "short", label: "Under 15 min" },
  { value: "medium", label: "15–30 min" },
  { value: "long", label: "30 min+" },
];

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Top Rated" },
];

/**
 * Filters bar for the full /watch-now "All Videos" page.
 * Controlled component — pass current values + change handlers.
 */
export default function Filters({
  search = "",
  onSearchChange,
  category = "",
  onCategoryChange,
  duration = "",
  onDurationChange,
  sort = "latest",
  onSortChange,
  categories = watchNowCategories,
}) {
  const selectClass =
    "text-sm font-medium text-[#1E293B] dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-3.5 py-2 outline-none";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <SearchBar value={search} onChange={onSearchChange} />
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange?.(e.target.value)}
        className={selectClass}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={duration}
        onChange={(e) => onDurationChange?.(e.target.value)}
        className={selectClass}
      >
        {DURATIONS.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange?.(e.target.value)}
        className={selectClass}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
