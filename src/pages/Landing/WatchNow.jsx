
import { useEffect, useState } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import videoService from "../../../../services/videoService";

function parseVideoUrl(rawUrl) {
  if (!rawUrl) return null;
  const url = rawUrl.trim();
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]{11})/,
  );
  if (ytMatch)
    return {
      type: "iframe",
      url: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch)
    return {
      type: "iframe",
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url))
    return { type: "video", url };
  return { type: "iframe", url };
}

function getVideoSourceUrl(item) {
  if (item.videoFileName)
    return videoService.getWatchNowStreamUrl(item.videoFileName);
  return item.externalVideoUrl || "";
}

function WatchNowSmartPlayer({ item }) {
  const rawUrl = getVideoSourceUrl(item);
  if (!rawUrl) return null;

  if (item.videoFileName) {
    return (
      <video
        src={rawUrl}
        controls
        autoPlay
        playsInline
        className="w-full h-full rounded-2xl bg-black object-cover"
      />
    );
  }

  const parsed = parseVideoUrl(rawUrl);
  if (!parsed) return null;

  if (parsed.type === "video") {
    return (
      <video
        src={parsed.url}
        controls
        autoPlay
        playsInline
        className="w-full h-full rounded-2xl bg-black object-cover"
      />
    );
  }

  const sep = parsed.url.includes("?") ? "&" : "?";
  return (
    <iframe
      src={`${parsed.url}${sep}autoplay=1`}
      title={item.personName || "WatchNow video"}
      className="w-full h-full rounded-2xl bg-black"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

/* ============================================================
   Single slide — matches Great Learning: text panel (left) +
   large media panel (right), one story visible at a time.
   ============================================================ */
function StorySlide({ item, isPlaying, onPlay }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 sm:p-10">
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white leading-snug mb-4">
          "{item.quote}"
        </h3>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
          <p className="font-bold text-[#1E293B] dark:text-white text-base">
            {item.personName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {item.personRole}
          </p>
        </div>
      </div>

      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
        {isPlaying ? (
          <WatchNowSmartPlayer item={item} />
        ) : (
          <button
            type="button"
            onClick={() => onPlay(item.id)}
            className="group relative w-full h-full block"
            aria-label={`Play video from ${item.personName}`}
          >
            <img
              src={videoService.getWatchNowStreamUrl(item.thumbnail)}
              alt={item.personName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 shadow-lg group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 text-[#7c3aed]" fill="#7c3aed" />
                <span className="text-sm font-bold text-[#1E293B]">
                  Watch story
                </span>
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

export default function WatchNowSection({ id = "watch-now" }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState({});

  useEffect(() => {
    let active = true;
    videoService
      .getWatchNowPublished()
      .then(({ data }) => {
        if (active) setStories(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Failed to load WatchNow stories", err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const handlePlay = (itemId) => {
    setPlaying((prev) => ({ ...prev, [itemId]: true }));
  };

  const goTo = (idx) => {
    setPlaying({});
    setActiveIndex((idx + stories.length) % stories.length);
  };

  const current = stories[activeIndex];

  return (
    <section
      id={id}
      className="py-16 sm:py-20 px-6 scroll-mt-20 bg-white dark:bg-gray-900/30"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-1.5 rounded-full mb-3">
            Watch Now
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E293B] dark:text-white">
            Learn Through,{" "}
            <span className="text-[#F97316]">Expert Sessions</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
            Explore live sessions, career guidance, interview preparation,
            hands-on projects, and expert-led learning designed to help you
            build real-world skills and grow your career.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-[#F97316] animate-spin" />
          </div>
        ) : stories.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-12">
            No stories published yet — check back soon.
          </p>
        ) : (
          <div className="relative">
            <StorySlide
              item={current}
              isPlaying={!!playing[current.id]}
              onPlay={handlePlay}
            />

            {stories.length > 1 && (
              <>
                <button
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Previous story"
                  className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white dark:bg-gray-800 shadow-lg items-center justify-center hover:scale-105 transition-transform"
                >
                  <ChevronLeft className="w-5 h-5 text-[#1E293B] dark:text-white" />
                </button>
                <button
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Next story"
                  className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white dark:bg-gray-800 shadow-lg items-center justify-center hover:scale-105 transition-transform"
                >
                  <ChevronRight className="w-5 h-5 text-[#1E293B] dark:text-white" />
                </button>

                <div className="flex justify-center gap-2 mt-6">
                  {stories.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => goTo(idx)}
                      aria-label={`Go to story ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === activeIndex
                          ? "w-6 bg-[#F97316]"
                          : "w-2 bg-gray-300 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
