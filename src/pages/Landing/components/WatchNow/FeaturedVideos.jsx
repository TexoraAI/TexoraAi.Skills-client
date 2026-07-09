import HorizontalCarousel from "../HorizontalCarousel";
import VideoCard from "./VideoCard";
import { featuredVideos } from "./data";

export default function FeaturedVideos({
  videos = featuredVideos,
  title = "Featured Learning Videos",
  onSelectVideo,
}) {
  if (!videos?.length) return null;

  return (
    <div className="mt-6 sm:mt-8">
      {title && (
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
          {title}
        </h3>
      )}
      <HorizontalCarousel
        items={videos}
        ariaLabel={title}
        getKey={(video) => video.id}
        cardMinHeight={160}
        renderItem={(video) => (
          <VideoCard video={video} onClick={() => onSelectVideo?.(video)} />
        )}
      />
    </div>
  );
}
