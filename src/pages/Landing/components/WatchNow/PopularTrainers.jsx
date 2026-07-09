import HorizontalCarousel from "../HorizontalCarousel";
import { Star, PlayCircle } from "lucide-react";
import { popularTrainers } from "./data";

export default function PopularTrainers({
  trainers = popularTrainers,
  title = "Popular Trainers",
  onSelectTrainer,
}) {
  if (!trainers?.length) return null;

  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
        {title}
      </h3>
      <HorizontalCarousel
        items={trainers}
        ariaLabel={title}
        getKey={(trainer) => trainer.id}
        cardMinHeight={150}
        renderItem={(trainer) => (
          <button
            type="button"
            onClick={() => onSelectTrainer?.(trainer)}
            className="flex flex-col items-center text-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-full"
          >
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#F97316] to-[#ea580c] text-white text-lg font-bold">
              {trainer.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
            <p className="text-sm font-semibold text-[#1E293B] dark:text-white line-clamp-1">
              {trainer.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {trainer.title}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {trainer.rating}
              </span>
              <span className="inline-flex items-center gap-1">
                <PlayCircle className="w-3 h-3" />
                {trainer.videos} videos
              </span>
            </div>
          </button>
        )}
      />
    </div>
  );
}
