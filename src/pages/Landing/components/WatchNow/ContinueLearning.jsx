import HorizontalCarousel from "../HorizontalCarousel";
import { Play } from "lucide-react";
import { continueLearning } from "./data";

export default function ContinueLearning({
  items = continueLearning,
  title = "Continue Learning",
  onSelectVideo,
}) {
  if (!items?.length) return null;

  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
        {title}
      </h3>
      <HorizontalCarousel
        items={items}
        ariaLabel={title}
        getKey={(item) => item.id}
        cardMinHeight={140}
        renderItem={(item) => (
          <button
            type="button"
            onClick={() => onSelectVideo?.(item)}
            className="group flex flex-col text-left w-full"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#0f172a]">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/95 shadow-md group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316] ml-0.5" />
                </span>
              </div>
              <div className="absolute left-0 right-0 bottom-0 h-1.5 bg-black/30">
                <div
                  className="h-full bg-[#F97316]"
                  style={{ width: `${item.progress ?? 0}%` }}
                />
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-[#1E293B] dark:text-white line-clamp-1">
              {item.title}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.progress ?? 0}% complete
            </span>
          </button>
        )}
      />
    </div>
  );
}
