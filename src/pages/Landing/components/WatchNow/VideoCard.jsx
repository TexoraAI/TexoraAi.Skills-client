import { Play } from "lucide-react";

const CATEGORY_COLORS = {
  "Web Development": "text-sky-600",
  "AI & ML": "text-purple-600",
  "Interview Prep": "text-[#F97316]",
  "Career Growth": "text-emerald-600",
  "Career Guidance": "text-purple-600",
  "Data Science": "text-sky-600",
  "Soft Skills": "text-emerald-600",
};

/**
 * VideoCard
 * Small thumbnail card: gradient placeholder + play button + duration badge,
 * title, and a colored category label underneath.
 * Pass a real `thumbnail` URL to swap the gradient for an <img>.
 */
export default function VideoCard({ video, onClick }) {
  const { title, category, duration, thumbnail } = video;
  const categoryColor = CATEGORY_COLORS[category] || "text-[#F97316]";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col text-left w-full"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#0f172a] shadow-sm">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_25%_25%,white,transparent_35%),radial-gradient(circle_at_75%_65%,white,transparent_30%)]" />
        )}

        {duration && (
          <span className="absolute top-2 right-2 text-[10px] font-semibold text-white bg-black/60 px-2 py-0.5 rounded-md">
            {duration}
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/95 shadow-md group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 text-[#F97316] fill-[#F97316] ml-0.5" />
          </span>
        </div>
      </div>

      <p className="mt-2 text-sm font-semibold text-[#1E293B] dark:text-white line-clamp-1">
        {title}
      </p>
      {category && (
        <span className={`text-xs font-medium ${categoryColor}`}>{category}</span>
      )}
    </button>
  );
}
