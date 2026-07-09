import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import WatchNowHero from "./components/WatchNow/WatchNowHero";
import LiveSessionHighlight from "./components/WatchNow/LiveSessionHighlight";
import FeaturedVideos from "./components/WatchNow/FeaturedVideos";
import ContinueLearning from "./components/WatchNow/ContinueLearning";
import RecommendedVideos from "./components/WatchNow/RecommendedVideos";
import TrendingCourses from "./components/WatchNow/TrendingCourses";
import RecentlyAdded from "./components/WatchNow/RecentlyAdded";
import PopularTrainers from "./components/WatchNow/PopularTrainers";
import UpcomingWebinars from "./components/WatchNow/UpcomingWebinars";
import Categories from "./components/WatchNow/Categories";
import Filters from "./components/WatchNow/Filters";
import VideoCard from "./components/WatchNow/VideoCard";

import {
  liveSession,
  featuredVideos,
  continueLearning,
  trendingCourses,
  recentlyAdded,
  recommendedVideos,
  popularTrainers,
  upcomingWebinars,
  watchNowCategories,
  watchNowFeatures,
} from "./components/WatchNow/data";

// Category label -> filter key, built from data.js so it stays in sync.
const CATEGORY_KEY_BY_LABEL = watchNowCategories.reduce((map, c) => {
  map[c.label] = c.key;
  return map;
}, {});

const DURATION_BUCKET = (durationLabel) => {
  const minutes = parseInt(durationLabel, 10) || 0;
  if (minutes < 15) return "short";
  if (minutes <= 30) return "medium";
  return "long";
};

/**
 * Combined "browse all" pool built from every video source, tagged with a
 * rough recency/popularity rank so the Filters sort control has something
 * real to work with. Swap this for a single `videoService.getAllWatchNow()`
 * call once the backend is wired up — the shape (id, title, category,
 * duration, thumbnail) already matches VideoCard's expectations.
 */
function buildVideoPool() {
  const sources = [
    { list: recentlyAdded, recencyRank: 0, popularityRank: 2 },
    { list: featuredVideos, recencyRank: 1, popularityRank: 0 },
    { list: trendingCourses, recencyRank: 2, popularityRank: 1 },
    { list: recommendedVideos, recencyRank: 3, popularityRank: 3 },
  ];

  const seen = new Set();
  const pool = [];

  sources.forEach(({ list, recencyRank, popularityRank }) => {
    list.forEach((video, index) => {
      if (seen.has(video.id)) return;
      seen.add(video.id);
      pool.push({ ...video, recencyRank, popularityRank, index });
    });
  });

  return pool;
}

export default function WatchNow() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [sort, setSort] = useState("latest");
  const [reminder, setReminder] = useState(null);

  useEffect(() => {
    if (!reminder) return;
    const timeout = setTimeout(() => setReminder(null), 4000);
    return () => clearTimeout(timeout);
  }, [reminder]);

  const videoPool = useMemo(() => buildVideoPool(), []);

  const filteredVideos = useMemo(() => {
    const query = search.trim().toLowerCase();

    let results = videoPool.filter((video) => {
      const matchesSearch =
        !query ||
        video.title.toLowerCase().includes(query) ||
        video.category?.toLowerCase().includes(query);

      const matchesCategory =
        !category || CATEGORY_KEY_BY_LABEL[video.category] === category;

      const matchesDuration =
        !duration || DURATION_BUCKET(video.duration) === duration;

      return matchesSearch && matchesCategory && matchesDuration;
    });

    results = [...results].sort((a, b) => {
      if (sort === "popular") return a.popularityRank - b.popularityRank;
      if (sort === "rating") return a.popularityRank - b.popularityRank;
      return a.recencyRank - b.recencyRank || a.index - b.index;
    });

    return results;
  }, [videoPool, search, category, duration, sort]);

  const goToVideo = (video) => {
    if (video?.id) {
      navigate(`/watch-now/${video.id}`);
    }
  };

  const goToLiveSession = () => goToVideo(liveSession);

  const handleSelectTrainer = (trainer) => {
    setSearch(trainer.name);
    setCategory("");
    setDuration("");
    document.getElementById("browse-videos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSetReminder = (webinar) => {
    setReminder(`Reminder set for "${webinar.title}" · ${webinar.date}`);
  };

  return (
    <div className="min-h-screen bg-[#F6EDE6] dark:bg-gray-950">
      {/* ── Hero: intro copy + live session spotlight ───────────────────── */}
      <section className="py-14 sm:py-20 px-6 scroll-mt-20 bg-white dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-2">
              <WatchNowHero
                features={watchNowFeatures}
                onWatchNow={() =>
                  document
                    .getElementById("browse-videos")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              />
            </div>
            <div className="lg:col-span-3">
              <LiveSessionHighlight session={liveSession} onPlay={goToLiveSession} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Continue Learning (only renders if there's in-progress content) ── */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <ContinueLearning items={continueLearning} onSelectVideo={goToVideo} />
        </div>
      </section>

      {/* ── Browse & filter all videos ───────────────────────────────────── */}
      <section id="browse-videos" className="py-10 sm:py-14 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white">
                Browse All Videos
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Search, filter by category or duration, and find exactly what you want to learn next.
              </p>
            </div>

            <Categories
              categories={watchNowCategories}
              activeKey={category}
              onSelect={(key) => setCategory(key || "")}
            />

            <Filters
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              duration={duration}
              onDurationChange={setDuration}
              sort={sort}
              onSortChange={setSort}
              categories={watchNowCategories}
            />
          </div>

          {reminder && (
            <div className="mb-6 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
              {reminder}
            </div>
          )}

          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} onClick={() => goToVideo(video)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <p className="font-semibold text-[#1E293B] dark:text-white mb-1">No videos match your filters</p>
              <p className="text-sm">Try clearing the search or picking a different category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Learning Videos ─────────────────────────────────────── */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <FeaturedVideos videos={featuredVideos} onSelectVideo={goToVideo} />
        </div>
      </section>

      {/* ── Trending Courses ─────────────────────────────────────────────── */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <TrendingCourses videos={trendingCourses} onSelectVideo={goToVideo} />
        </div>
      </section>

      {/* ── Recently Added ───────────────────────────────────────────────── */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <RecentlyAdded videos={recentlyAdded} onSelectVideo={goToVideo} />
        </div>
      </section>

      {/* ── Recommended For You ──────────────────────────────────────────── */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <RecommendedVideos videos={recommendedVideos} onSelectVideo={goToVideo} />
        </div>
      </section>

      {/* ── Popular Trainers ─────────────────────────────────────────────── */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <PopularTrainers trainers={popularTrainers} onSelectTrainer={handleSelectTrainer} />
        </div>
      </section>

      {/* ── Upcoming Webinars ────────────────────────────────────────────── */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <UpcomingWebinars webinars={upcomingWebinars} onSetReminder={handleSetReminder} />
        </div>
      </section>
    </div>
  );
}