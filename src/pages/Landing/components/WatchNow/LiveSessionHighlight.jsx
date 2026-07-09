import { Play, Eye, Clock, Star } from "lucide-react";
import { liveSession } from "./data";

export default function LiveSessionHighlight({ session = liveSession, onPlay }) {
  const { isLive, label, title, description, mentor, views, duration, rating, thumbnail } = session;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-br from-[#1E293B] via-[#243244] to-[#0f1b12]">
      {thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      )}
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_85%_70%,white,transparent_30%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />

      {/* Top badges */}
      <div className="absolute top-5 left-5 flex items-center gap-2">
        {isLive && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-red-600 text-white px-2.5 py-1 rounded-md">
            Live
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {label}
        </span>
      </div>

      {/* Title / description */}
      <div className="absolute top-16 left-5 right-24 sm:right-40">
        <h3 className="text-white text-2xl sm:text-3xl font-bold leading-tight mb-2">
          {title}
        </h3>
        <p className="text-white/80 text-sm sm:text-base max-w-sm">
          {description}
        </p>
      </div>

      {/* Play button */}
      <button
        type="button"
        onClick={onPlay}
        aria-label={`Play ${title}`}
        className="absolute top-1/2 right-8 sm:right-16 -translate-y-1/2 flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg hover:scale-110 transition-transform"
      >
        <Play className="w-8 h-8 text-[#F97316] fill-[#F97316] ml-1" />
      </button>

      {/* Mentor + stats footer */}
      <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-[#1E293B] text-xs font-bold shrink-0">
            {mentor?.name
              ?.split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">{mentor?.name}</p>
            <p className="text-white/70 text-xs leading-tight">{mentor?.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white bg-black/40 px-2.5 py-1 rounded-full">
            <Eye className="w-3 h-3" /> {views}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white bg-black/40 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" /> {duration}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white bg-black/40 px-2.5 py-1 rounded-full">
            <Star className="w-3 h-3 fill-current text-yellow-400" /> {rating}
          </span>
        </div>
      </div>
    </div>
  );
}
