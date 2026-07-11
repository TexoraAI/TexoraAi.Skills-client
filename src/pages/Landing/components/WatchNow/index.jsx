// import { useNavigate } from "react-router-dom";
// import WatchNowHero from "./WatchNowHero";
// import LiveSessionHighlight from "./LiveSessionHighlight";
// import FeaturedVideos from "./FeaturedVideos";
// import { liveSession, featuredVideos, watchNowFeatures } from "./data";

// /**
//  * WatchNow landing-page section.
//  *
//  * This is the compact "teaser" composition shown on the homepage:
//  * Hero copy + live session spotlight + a row of featured videos + stats.
//  *
//  * It's intentionally scoped to just what the homepage needs — the rest of
//  * the WatchNow module (all-videos grid, filters, categories, continue
//  * learning, trending, recently added, recommended, popular trainers,
//  * upcoming webinars, trainer profile, etc.) lives in the sibling files in
//  * this folder and can be composed into a dedicated `/watch-now` route
//  * without touching the homepage.
//  */
// export default function WatchNowSection({
//   id = "watch-now",
//   session = liveSession,
//   videos = featuredVideos,
//   features = watchNowFeatures,
// }) {
//   const navigate = useNavigate();

//   const goToWatchNow = (video) => {
//     if (video?.id) {
//       navigate(`/watch-now/${video.id}`);
//     } else {
//       navigate("/watch-now");
//     }
//   };

//   return (
//     <section
//       id={id}
//       className="py-16 sm:py-20 px-6 scroll-mt-20 bg-white dark:bg-gray-900/30"
//     >
//       <div className="max-w-7xl mx-auto">
//         <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
//           <div className="lg:col-span-2">
//             <WatchNowHero features={features} onWatchNow={() => goToWatchNow()} />
//           </div>
//           <div className="lg:col-span-3">
//             <LiveSessionHighlight session={session} onPlay={() => goToWatchNow(session)} />
//           </div>
//         </div>

//         <FeaturedVideos videos={videos} onSelectVideo={goToWatchNow} />

//       </div>
//     </section>
//   );
// }
import { useEffect, useState } from "react";
import { Play, Quote } from "lucide-react";
import videoService from "../../../../services/videoService";

/* ============================================================
   parseVideoUrl — same pattern as VideoList.jsx: detects YouTube
   (watch/shorts/embed), Vimeo, or a direct video file URL, and
   returns either { type: "iframe", url } or { type: "video", url }.
   ============================================================ */
function parseVideoUrl(rawUrl) {
  if (!rawUrl) return null;
  const url = rawUrl.trim();

  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]{11})/,
  );
  if (ytMatch) {
    return {
      type: "iframe",
      url: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      type: "iframe",
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)) {
    return { type: "video", url };
  }

  // Unknown format — best effort, treat as embeddable iframe
  return { type: "iframe", url };
}

/* ============================================================
   getVideoSourceUrl — resolves whichever URL field is present:
   an uploaded file (streamed from our backend) or an external
   YouTube/Vimeo/direct link. Exactly one is present per item.
   ============================================================ */
function getVideoSourceUrl(item) {
  if (item.videoFileName) {
    return videoService.getWatchNowStreamUrl(item.videoFileName);
  }
  return item.externalVideoUrl || "";
}

/* ============================================================
   WatchNowSmartPlayer — renders a <video> tag for an uploaded
   file or a direct link, or an <iframe> for YouTube/Vimeo embeds.
   ============================================================ */
function WatchNowSmartPlayer({ item }) {
  const rawUrl = getVideoSourceUrl(item);
  if (!rawUrl) return null;

  // Our own uploaded file is always a direct <video> source.
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
   Story card — thumbnail + Play overlay, swaps to the inline
   SmartPlayer in place on click. Never navigates away.
   ============================================================ */
function StoryCard({ item, isPlaying, onPlay }) {
  return (
    <div className="w-full h-full flex flex-col rounded-2xl border border-[#ECECEC] dark:border-gray-800 bg-white dark:bg-gray-900 shadow-[0_10px_35px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="relative w-full aspect-video bg-black">
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
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors flex items-center justify-center">
              <span className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play
                  className="w-6 h-6 text-[#7c3aed] ml-0.5"
                  fill="#7c3aed"
                />
              </span>
            </div>
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <Quote
          className="w-5 h-5 text-[#F97316]/40 flex-shrink-0"
          fill="currentColor"
          strokeWidth={0}
        />
        <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-6 line-clamp-4 flex-1">
          "{item.quote}"
        </p>
        <div className="pt-3 border-t border-[#ECECEC] dark:border-gray-800">
          <p className="font-bold text-[#1E293B] dark:text-white text-sm truncate">
            {item.personName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {item.personRole}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   WatchNowSection — consolidated public WatchNow component.
   Fetches published stories and renders them as a card grid.
   Used both on the homepage (<WatchNowSection />) and on the
   /watch-now route (via Watchnow.jsx importing this file).
   ============================================================ */
export default function WatchNowSection({ id = "watch-now" }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <section
      id={id}
      className="py-16 sm:py-20 px-6 scroll-mt-20 bg-white dark:bg-gray-900/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-1.5 rounded-full mb-3">
            Watch Now
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E293B] dark:text-white">
            Learn Through,{" "}
            <span className="text-[#F97316]"> Expert Sessions</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {stories.map((item) => (
              <StoryCard
                key={item.id}
                item={item}
                isPlaying={!!playing[item.id]}
                onPlay={handlePlay}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
