import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { courseService } from "../../../services/courseService";

/* ─────────────────────────────────────────────────────────────────
   Banner Studio (backend-connected promotional banner carousel)
───────────────────────────────────────────────────────────────── */
export default function AnnouncementBanner() {
  // ── Banner Studio — backend-connected promotional banner ──
  const [activeBanners, setActiveBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  /* ── Load the active promotional banner(s) (Banner Studio) ── */
  useEffect(() => {
    async function loadActiveBanners() {
      try {
        const { data } = await courseService.getActiveBanners();
        setActiveBanners(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load banners", err);
      }
    }
    loadActiveBanners();
    // Keep the carousel in sync whenever Super Admin uploads/updates banners
    const refreshTimer = setInterval(loadActiveBanners, 60000);
    return () => clearInterval(refreshTimer);
  }, []);

  /* ── Register a view for whichever banner is currently visible ── */
  useEffect(() => {
    if (activeBanners.length === 0) return;
    if (currentBannerIndex >= activeBanners.length) {
      setCurrentBannerIndex(0);
      return;
    }
    courseService.registerBannerView(activeBanners[currentBannerIndex].id).catch(() => {});
  }, [activeBanners, currentBannerIndex]);

  /* ── Auto-slide the banner carousel when there is more than one active banner ── */
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const slideTimer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const bannerCount = activeBanners.length;
  const safeIndex =
    currentBannerIndex < bannerCount ? currentBannerIndex : 0;

  const goToPrevBanner = (e) => {
    e.stopPropagation();
    setCurrentBannerIndex((prev) => (prev - 1 + bannerCount) % bannerCount);
  };

  const goToNextBanner = (e) => {
    e.stopPropagation();
    setCurrentBannerIndex((prev) => (prev + 1) % bannerCount);
  };

  return (
    <section className="w-full px-4 sm:px-6 pt-[84px]">
      <div
        className="max-w-7xl mx-auto rounded-b-xl overflow-hidden relative group"
        style={{ width: "100%", maxWidth: "80rem", margin: "0 auto" }}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            display: "flex",
            width: "100%",
            transform: `translateX(-${safeIndex * 100}%)`,
          }}
        >
          {activeBanners.map((banner, idx) => {
            const hasImage =
              banner.desktopImageUrl ||
              banner.tabletImageUrl ||
              banner.mobileImageUrl;

            const handleBannerClick = () => {
              if (idx !== safeIndex) return;
              courseService.registerBannerClick(banner.id).catch(() => {});
              if (banner.ctaLink) window.open(banner.ctaLink, "_blank");
            };

            return (
              <div
                key={banner.id || idx}
                className="w-full flex-shrink-0"
                style={{
                  cursor: banner.ctaLink ? "pointer" : "default",
                  width: "100%",
                  flexShrink: 0,
                }}
                onClick={handleBannerClick}
              >
                {hasImage ? (
                  // ── Uploaded / AI / builder artwork — the image IS the banner ──
                  // NOTE: width is forced via inline style (not just the Tailwind
                  // class) so the banner always spans the full container even if
                  // the utility classes don't take effect for any reason — this is
                  // what was causing the image to render at its natural size,
                  // flush-left, instead of stretching full width.
                  <picture style={{ display: "block", width: "100%" }}>
                    {banner.mobileImageUrl && (
                      <source
                        media="(max-width: 640px)"
                        srcSet={banner.mobileImageUrl}
                      />
                    )}
                    {banner.tabletImageUrl && (
                      <source
                        media="(max-width: 1024px)"
                        srcSet={banner.tabletImageUrl}
                      />
                    )}
                    <img
                      src={
                        banner.desktopImageUrl ||
                        banner.tabletImageUrl ||
                        banner.mobileImageUrl
                      }
                      alt={banner.name || "Promotional banner"}
                      className="w-full h-auto object-cover block"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  </picture>
                ) : (
                  // ── No image uploaded — fall back to the text-only gradient strip ──
                  <div
                    className="flex items-center justify-between gap-4 py-4 px-4 sm:px-6 text-white"
                    style={{ background: banner.gradient || "#1E293B" }}
                  >
                    <div>
                      {banner.eyebrow && (
                        <p className="text-xs uppercase tracking-widest opacity-80">
                          {banner.eyebrow}
                        </p>
                      )}
                      <p className="text-lg font-bold">
                        {banner.emoji} {banner.title || banner.name}
                      </p>
                      {banner.subtitle && (
                        <p className="text-sm opacity-90">{banner.subtitle}</p>
                      )}
                    </div>
                    {banner.ctaText && (
                      <span className="flex-shrink-0 bg-white/15 hover:bg-white/25 transition px-4 py-2 rounded-lg text-sm font-semibold">
                        {banner.ctaText}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Prev / Next navigation — only shown when multiple banners are active ── */}
        {bannerCount > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevBanner}
              aria-label="Previous banner"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition hover:bg-black/60"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goToNextBanner}
              aria-label="Next banner"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition hover:bg-black/60"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* ── Slide indicator dots ── */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
              {activeBanners.map((banner, idx) => (
                <button
                  type="button"
                  key={banner.id || idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentBannerIndex(idx);
                  }}
                  aria-label={`Go to banner ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === safeIndex
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
























































