import { useMuxVideo } from "@/hooks/useVideo";
import type { Type, Video } from "@/payload-types";
import { cn } from "@/utils/cn";
import { isMedia, type Populated } from "@/utils/typeChecks";
import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import MuxPlayer from "@mux/mux-player-react/lazy";
import "@mux/mux-player-react/themes/minimal";
import {
  FolderSimpleStarIcon,
  FunnelIcon,
  FunnelSimpleIcon,
  PlayIcon,
} from "@phosphor-icons/react/ssr";
import { motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getSnapTargetVertical } from "scrollsnap-events/core";
import scrollIntoView from "smooth-scroll-into-view-if-needed";
import Image, { getImageUrl } from "./Image";
import { PortfolioFilter } from "./PortfolioFilter";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

const VideoGridContext = createContext<{
  isUIVisible: boolean;
  setIsUIVisible: (visible: boolean) => void;
}>({ isUIVisible: true, setIsUIVisible: () => {} });

export function FilteredVideoGrid({
  categories,
  videos,
}: {
  categories: Type[];
  videos: Populated<Video>[];
}) {
  const [isUIVisible, setIsUIVisible] = useState(true);

  const [snappedVideoId, setSnappedVideoId] = useState<string>();

  const handleSnappedVideoId = (
    event: Event & { snapTargetBlock?: HTMLElement },
  ) => {
    const snappedElement = event.snapTargetBlock as HTMLElement;

    const videoId = snappedElement.dataset.id;
    if (videoId) {
      setSnappedVideoId(videoId);
    }
  };

  // useEffect(() => {
  //   if (snappedVideoId) {
  //     const slug = videos.find(
  //       (video) => video.id === Number(snappedVideoId),
  //     )?.slug;
  //     if (!slug) return;
  //     const currentUrl = new URL(window.location.href);
  //     currentUrl.pathname = `/videos/${slug}`;
  //     history.replaceState(null, "", currentUrl.toString());
  //   }
  // }, [snappedVideoId]);

  useEffect(() => {
    // catch scenario where user lands on page with ?video=slug query param
    const params = new URLSearchParams(window.location.search);
    const videoSlug = params.get("video");
    if (videoSlug) {
      const video = videos.find((video) => video.slug === videoSlug);
      if (video) {
        setSnappedVideoId(String(video.id));
        const element = document.querySelector(`[data-id="${video.id}"]`);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.delete("video");
          history.replaceState(null, "", currentUrl.toString());
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!snappedVideoId) {
      const currentSnappedElement = getSnapTargetVertical(
        document.documentElement,
      )?.dataset.id;

      if (currentSnappedElement) {
        setSnappedVideoId(currentSnappedElement);
      }
    }

    document.addEventListener("scrollsnapchange", handleSnappedVideoId);

    return () => {
      document.removeEventListener("scrollsnapchange", handleSnappedVideoId);
    };
  }, []);

  useEffect(() => {
    document.querySelector("header").dataset.hide = isUIVisible
      ? "false"
      : "true";
  }, [isUIVisible]);

  return (
    <VideoGridContext.Provider value={{ isUIVisible, setIsUIVisible }}>
      <motion.div
        className="flex w-full flex-col gap-8"
        animate={isUIVisible ? "uiVisible" : "uiHidden"}
      >
        <div className="no-scrollbar flex flex-col gap-8">
          <motion.div
            className="sticky top-8 left-4 z-10 lg:top-20"
            variants={{
              uiVisible: { opacity: 1, y: 0 },
              uiHidden: { opacity: 0, y: "-100%" },
            }}
          >
            <div className="flex gap-1 py-4">
              <h1 className="m-0 hidden p-5 text-[clamp(2rem,5vw,2.65rem)] font-bold tracking-wide lg:block">
                Videos
              </h1>
              {/* <h1 className="m-0 hidden p-5 text-[clamp(2rem,5vw,2.65rem)] font-bold tracking-wide opacity-50 lg:block">
                Stills
              </h1> */}
            </div>
          </motion.div>

          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              snapped={video.id == Number(snappedVideoId)}
            />
          ))}
        </div>

        <VideoList
          videos={videos}
          snappedVideoId={snappedVideoId}
          categories={categories}
        />
      </motion.div>
    </VideoGridContext.Provider>
  );
}

function VideoList({
  videos,
  snappedVideoId,
  categories,
}: {
  videos: Populated<Video>[];
  snappedVideoId?: string | number;
  categories: Type[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>();
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // If a video is snapped, scroll it into view in the list if it's not already
  useEffect(() => {
    if (snappedVideoId) {
      const element = document.querySelector(
        `[data-list-id="${snappedVideoId}"]`,
      );
      if (element) {
        scrollIntoView(element, {
          behavior: "smooth",
          block: "center",
          duration: 500,
          inline: "center",
          scrollMode: "if-needed",
          boundary: element?.parentElement,
        });
      }
    }
  }, [snappedVideoId]);

  const filteredVideos = videos.filter((video) => {
    if (!activeCategory) return true;

    return video.type.slug === activeCategory;
  });

  return isFilterMenuOpen ? (
    <motion.div
      layout
      layoutId="filter-menu"
      className="fixed right-2.5 bottom-[calc(env(safe-area-inset-bottom)+10px)] z-10 flex items-center gap-2 rounded-full bg-gray-200/20 px-7 py-4 text-sm font-medium ring ring-white/10 backdrop-blur-lg duration-150 ring-inset active:bg-gray-200/40 lg:hidden"
      variants={{
        uiVisible: { opacity: 0, x: 100 },
        uiHidden: { opacity: 1, x: 0 },
      }}
      onTap={() => {
        setIsFilterMenuOpen(true);
      }}
    >
      <FunnelIcon weight="bold" />
      <span>Filter</span>
    </motion.div>
  ) : (
    <motion.div
      layout
      layoutId="filter-menu"
      className="fixed top-0 right-0 z-10 ml-auto hidden h-screen w-100 flex-col gap-3 overflow-y-auto pr-4 xl:flex"
      style={{
        mask: `linear-gradient(var(--mask-start-deg, 0deg),rgba(0, 0, 0, 0) 0%,#000 5%,#000 6%,96%,rgba(0, 0, 0, 0) 100%)`,
      }}
      variants={{
        uiVisible: { opacity: 1, x: 0 },
        uiHidden: { opacity: 0, x: "100%" },
      }}
    >
      <div className="block max-h-20 min-h-20" />
      <PortfolioFilter
        onChange={setActiveCategory}
        categories={categories}
        activeCategory={activeCategory}
      />
      {filteredVideos.map((video, i) => (
        <motion.div
          data-list-id={video.id}
          key={video.id}
          onTap={() => {
            const element = document.querySelector(`[data-id="${video.id}"]`);
            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }}
          className={cn(
            "grid min-h-20 w-full cursor-pointer grid-cols-6 overflow-hidden rounded-lg opacity-50 duration-500 select-none",
            {
              "opacity-100": video.id === Number(snappedVideoId) || i === 0,
            },
          )}
        >
          <Image
            width={400}
            media={video.image}
            alt={video.title}
            className="col-span-2 aspect-video rounded-lg object-cover duration-300"
          />

          <div className="col-span-4 flex flex-col gap-1 p-2">
            <span className="text-xxs inline-flex gap-2 overflow-clip tracking-widest whitespace-nowrap uppercase">
              {video.type?.title}
            </span>
            <span className="font-medium text-pretty">{video.title}</span>
          </div>
        </motion.div>
      ))}
      <div className="block max-h-20 min-h-20" />
    </motion.div>
  );
}

function VideoCard({
  video,
  snapped,
}: {
  video: Populated<Video>;
  snapped?: boolean;
}) {
  const { isUIVisible } = useContext(VideoGridContext);
  const ref = useRef<MuxPlayerRefAttributes>(null);
  const [isPreview, setIsPreview] = useState(true);
  const { setIsUIVisible } = useContext(VideoGridContext);

  useEffect(() => {
    if (!snapped) {
      setIsPreview(true);
      setIsUIVisible(true);
    }
  }, [snapped]);

  return (
    <motion.div
      data-id={video.id}
      data-snapped={snapped}
      className={cn(
        "timeline-view animate-watch-scroll allow-discrete relative h-svh max-h-[calc(100vh-150px)] snap-center overflow-hidden rounded-xl duration-700 perspective-near perspective-origin-center sm:aspect-video lg:h-full",
        {
          "xl:max-w-[80%]": isUIVisible,
        },
      )}
    >
      {snapped && (
        <MuxPlayer
          ref={ref}
          className={cn("size-full rounded-xl object-cover duration-700", {
            "[--controls:none] [--media-object-fit:cover]": isPreview,
            "scale-125": video.hasCropMarks && isPreview,
          })}
          defaultHiddenCaptions={isPreview}
          defaultDuration={isPreview ? 10 : undefined}
          theme="minimal"
          src={video.videom3u8 || video.previewURL}
          poster={getImageUrl({
            alt: "",
            media: video.image,
            height: 500 / (16 / 9),
            width: 500,
          })}
          autoPlay
          loading="viewport"
          muted={isPreview}
          onTimeUpdate={(e) => {
            if (!isPreview) return;
            const target = e.currentTarget as HTMLVideoElement;
            if (target.currentTime > 10) {
              target.currentTime = 0;
            }
          }}
          playsInline
          loop={isPreview}
        />
      )}

      <div className="absolute inset-0 z-2 aspect-9/16 size-full overflow-hidden rounded-xl object-cover opacity-100 duration-700 sm:aspect-video">
        {isMedia(video.image) && (
          <Image
            media={video.image}
            loading="lazy"
            width={1300}
            operations={{ dpr: 2 }}
            alt=""
            className={cn(
              "size-full max-h-full! max-w-full! object-cover opacity-100 duration-1000",
              {
                "opacity-0": snapped,
                "scale-125": video.hasCropMarks && isPreview,
              },
            )}
          />
        )}
        {isPreview && (
          <>
            <button
              className="absolute top-1/2 left-1/2 z-10 -ml-px -translate-1/2 rounded-full p-4 hover:bg-white/20"
              onClick={() => {
                setIsPreview(false);
                setIsUIVisible(false);
                ref.current.currentTime = 0;
              }}
            >
              <PlayIcon weight="fill" size="80" />
            </button>

            <div className="spring-duration-700 spring-bounce-40 absolute bottom-0 left-0 isolate z-10 w-full">
              <div className="progressive-blur-container absolute right-0 bottom-0 left-0 size-full h-[130%]">
                <div className="blur-filter" />
                <div className="blur-filter" />
                <div className="blur-filter" />
                <div className="blur-filter" />
                <div className="blur-filter" />
                <div className="blur-filter" />
                <div className="blur-filter" />
                <div className="absolute inset-0 size-full bg-linear-0 from-black/50 to-transparent" />
              </div>

              <div className="flex flex-col px-4 pb-6 lg:px-6 lg:pb-9">
                <span className="relative z-10 line-clamp-1 inline-flex w-full items-center text-xs tracking-widest uppercase duration-200">
                  {typeof video.type !== "number" && "title" in video.type && (
                    <span className="mr-2 inline-flex gap-2 overflow-clip tracking-widest whitespace-nowrap uppercase">
                      {video.type.title}
                    </span>
                  )}
                </span>
                <span className="overflow-gradient-mask pointer-events-none relative z-10 flex w-full items-center overflow-clip text-3xl font-semibold lg:text-4xl">
                  {video.title}
                </span>

                {video.body && (
                  <div
                    className="relative z-10 hidden max-w-200 pt-4 text-sm font-medium text-gray-200 lg:block"
                    dangerouslySetInnerHTML={{
                      __html: convertLexicalToHTML({ data: video.body }),
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
