/* ─────────────────────────────────────────────────────────────────
   COURSE CARD — icon, name, short description, difficulty badge,
   and total course count. Hover: orange border, soft shadow, lift.
───────────────────────────────────────────────────────────────── */
const LEVEL_STYLES = {
  Beginner: {
    light: "bg-emerald-50 text-emerald-600",
    dark: "bg-emerald-500/10 text-emerald-400",
  },
  Intermediate: {
    light: "bg-orange-50 text-[#F97316]",
    dark: "bg-[#F97316]/10 text-[#F97316]",
  },
  Advanced: {
    light: "bg-rose-50 text-rose-600",
    dark: "bg-rose-500/10 text-rose-400",
  },
};

export default function CourseCard({ course, theme, onClick }) {
  const isDark = theme === "dark";
  const { Icon, name, desc, level, count, flagCode } = course;
  const levelStyle = level ? LEVEL_STYLES[level] || LEVEL_STYLES.Beginner : null;
  const hasMeta = Boolean(level || count);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group text-left w-full h-full flex flex-col gap-3 p-4 rounded-2xl border transition-all duration-200 ease-out
        hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:border-[#F97316]
        ${
          isDark
            ? "bg-[#1E1E1E] border-white/[0.08] hover:bg-[#212121]"
            : "bg-white border-gray-100 hover:shadow-[0_12px_28px_rgba(249,115,22,0.12)]"
        }`}
    >
      {flagCode ? (
        <span className="w-11 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-black/[0.06]">
          <img
            src={`https://flagcdn.com/w80/${flagCode}.png`}
            alt=""
            width="44"
            height="32"
            className="w-full h-full object-cover"
          />
        </span>
      ) : (
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 ${
            isDark
              ? "bg-[#F97316]/10 text-[#F97316] group-hover:bg-[#F97316]/20"
              : "bg-orange-50 text-[#F97316] group-hover:bg-orange-100"
          }`}
        >
          {Icon && <Icon size={20} />}
        </div>
      )}

      <div className="flex-1">
        <h4
          className={`text-[15px] font-bold leading-snug ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {name}
        </h4>
        {desc && (
          <p
            className={`text-[13px] mt-1 leading-snug ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {desc}
          </p>
        )}
      </div>

      {hasMeta && (
        <div className="flex items-center justify-between pt-1">
          {level && (
            <span
              className={`text-[11px] font-semibold px-2 py-1 rounded-md ${
                isDark ? levelStyle.dark : levelStyle.light
              }`}
            >
              {level}
            </span>
          )}
          {count && (
            <span
              className={`text-[12px] font-medium ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {count}
            </span>
          )}
        </div>
      )}
    </button>
  );
}