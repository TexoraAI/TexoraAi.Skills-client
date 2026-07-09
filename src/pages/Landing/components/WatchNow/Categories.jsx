import { watchNowCategories } from "./data";

export default function Categories({
  categories = watchNowCategories,
  activeKey,
  onSelect,
}) {
  if (!categories?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect?.(null)}
        className={`text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-1.5 rounded-full border transition-colors ${
          !activeKey
            ? "bg-[#F97316] text-white border-[#F97316]"
            : "bg-white dark:bg-gray-900 text-[#1E293B] dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#F97316] hover:text-[#F97316]"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.key}
          type="button"
          onClick={() => onSelect?.(category.key)}
          className={`text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
            activeKey === category.key
              ? "bg-[#F97316] text-white border-[#F97316]"
              : "bg-white dark:bg-gray-900 text-[#1E293B] dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#F97316] hover:text-[#F97316]"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
