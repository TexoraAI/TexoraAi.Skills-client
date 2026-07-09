import { useNavigate } from "react-router-dom";
import WatchNowHero from "./WatchNowHero";
import LiveSessionHighlight from "./LiveSessionHighlight";
import FeaturedVideos from "./FeaturedVideos";
import { liveSession, featuredVideos, watchNowFeatures } from "./data";

/**
 * WatchNow landing-page section.
 *
 * This is the compact "teaser" composition shown on the homepage:
 * Hero copy + live session spotlight + a row of featured videos + stats.
 *
 * It's intentionally scoped to just what the homepage needs — the rest of
 * the WatchNow module (all-videos grid, filters, categories, continue
 * learning, trending, recently added, recommended, popular trainers,
 * upcoming webinars, trainer profile, etc.) lives in the sibling files in
 * this folder and can be composed into a dedicated `/watch-now` route
 * without touching the homepage.
 */
export default function WatchNowSection({
  id = "watch-now",
  session = liveSession,
  videos = featuredVideos,
  features = watchNowFeatures,
}) {
  const navigate = useNavigate();

  const goToWatchNow = (video) => {
    if (video?.id) {
      navigate(`/watch-now/${video.id}`);
    } else {
      navigate("/watch-now");
    }
  };

  return (
    <section
      id={id}
      className="py-16 sm:py-20 px-6 scroll-mt-20 bg-white dark:bg-gray-900/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-2">
            <WatchNowHero features={features} onWatchNow={() => goToWatchNow()} />
          </div>
          <div className="lg:col-span-3">
            <LiveSessionHighlight session={session} onPlay={() => goToWatchNow(session)} />
          </div>
        </div>

        <FeaturedVideos videos={videos} onSelectVideo={goToWatchNow} />

        
      </div>
    </section>
  );
}
