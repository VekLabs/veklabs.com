import type { Type, Video } from "@/payload-types";
import { isMedia, type Populated } from "@/utils/typeChecks";
import { useState } from "react";
import { PortfolioFilter } from "./PortfolioFilter";
import VideoCard from "./VideoCard";
import Image from "./Image";

export function FilteredVideoGrid({
  categories,
  videos,
}: {
  categories: Type[];
  videos: Populated<Video>[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>();

  const filteredVideos = videos.filter((video) => {
    if (!activeCategory) return true;

    return video.type.slug === activeCategory;
  });

  return (
    <div className="flex w-full flex-col gap-8">
      {/* <PortfolioFilter
        onChange={setActiveCategory}
        categories={categories}
        activeCategory={activeCategory}
      /> */}

      <div className="no-scrollbar flex flex-col gap-8">
        <div className="flex items-center gap-6 pb-4">
          <h1 className="m-0 text-[clamp(2rem,5vw,2.65rem)] font-bold tracking-wide">
            Portfolio
          </h1>
        </div>
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="timeline-view animate-watch-scroll relative aspect-9/16 h-[calc(100%-150px)] max-h-full snap-center perspective-near perspective-origin-center md:aspect-video"
          >
            <div className="absolute inset-0 aspect-9/16 size-full overflow-hidden rounded-xl object-cover opacity-100 duration-700 group-hover:opacity-0 md:aspect-video">
              {isMedia(video.image) && (
                <Image
                  media={video.image}
                  loading="lazy"
                  width={1300}
                  operations={{ dpr: 2 }}
                  alt=""
                  className="size-full max-h-full! max-w-full! object-cover"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
