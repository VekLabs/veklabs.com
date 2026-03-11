import { useMuxVideo } from "@/hooks/useVideo";
import type { Video } from "@/payload-types";
import { cn } from "@/utils/cn";
import type { Populated } from "@/utils/typeChecks";
import MuxPlayer, { type MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import {
  SpeakerSimpleHighIcon,
  SpeakerSimpleSlashIcon,
} from "@phosphor-icons/react";
import { PauseCircleIcon, PlayCircleIcon } from "@phosphor-icons/react/ssr";
import cx from "classnames";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useSpring,
  useTransform,
} from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import scrollIntoView from "smooth-scroll-into-view-if-needed";
import {
  useDebounceCallback,
  useOnClickOutside,
  useResizeObserver,
  useScrollLock,
} from "usehooks-ts";
import logoFullSVG from "../images/logo-full.svg?url";
import Image from "./Image";

const VIDEO_PLAY_DURATION = 20;
const VIDEO_START_TIME = 30;

export type BigVideoPlayerProps = {
  videos: Populated<Video & { isBrandVideo?: boolean }>[];
  mode?: "preview" | "full";
};

const BigVideoPlayerContext = createContext<
  Pick<BigVideoPlayerProps, "mode"> & {
    isShowingUI: boolean;
    isUILocked: boolean;
    setIsUILocked: (value: boolean) => void;
  }
>({
  mode: "preview",
  isShowingUI: true,
  isUILocked: false,
  setIsUILocked: () => {},
});

export default function BigVideoPlayer({
  videos,
  mode = "preview",
}: BigVideoPlayerProps) {
  const [activeVideo, setActiveVideo] = useState(videos?.[0] || null);
  const [isShowingUI, setIsShowingUI] = useState(true);
  const [isUILocked, setIsUILocked] = useState(false);
  const [showingInfo, setShowingInfo] = useState(false);
  const ref = useRef<MuxPlayerRefAttributes>(null);
  const muxVideo = useMuxVideo(ref);
  const infoRef = useRef(null);

  const debouncedHide = useDebounceCallback(() => setIsShowingUI(false), 4000);

  useEffect(() => {
    if (mode !== "full") return;

    document.querySelector("header").dataset.hide = isShowingUI
      ? "false"
      : "true";

    return () => {
      document.querySelector("header").dataset.hide = "false";
    };
  }, [mode, isShowingUI]);

  useEffect(() => {
    if (!muxVideo.isPlaying) {
      debouncedHide.cancel();
    }
  }, [muxVideo.isPlaying]);

  useEffect(() => {
    if (isUILocked) {
      debouncedHide.cancel();
      setIsShowingUI(true);
    }
  }, [isUILocked]);

  useEffect(() => {
    if (mode !== "full") return;
    debouncedHide();
  }, []);

  useOnClickOutside(infoRef, () => {
    setShowingInfo(false);
  });

  useEffect(() => {
    if (showingInfo) {
      scrollLock.lock();
    } else {
      scrollLock.unlock();
    }

    return () => {
      scrollLock.unlock();
    };
  }, [showingInfo]);

  const scrollLock = useScrollLock({ autoLock: false });

  return (
    <BigVideoPlayerContext.Provider
      value={{ mode, isShowingUI, isUILocked, setIsUILocked }}
    >
      <motion.div
        className="relative overflow-clip"
        onMouseMove={(e) => {
          debouncedHide.cancel();
          setIsShowingUI(true);

          if (
            isUILocked ||
            mode !== "full" ||
            !muxVideo.isPlaying ||
            showingInfo
          )
            return;

          // if we're not hovering over some UI element inside the video player, start the debounce to hide the UI
          if (!(e.target as HTMLElement).closest(".bvp-ui")) {
            debouncedHide();
          }
        }}
        animate={isShowingUI ? "hover" : "rest"}
      >
        <VideoPlayer
          video={activeVideo}
          muxVideo={muxVideo}
          ref={ref}
          isBrandVideo={activeVideo.isBrandVideo}
          onVideoEnd={() => {
            const indexOfActiveVideo = videos.findIndex(
              (video) => video.id === activeVideo.id,
            );
            const nextVideo = videos[indexOfActiveVideo + 1] || videos[0];
            setActiveVideo(nextVideo);
          }}
        />

        <motion.div className="bvp-ui contents">
          <MotionConfig
            transition={{
              duration: 0.5,
              opacity: { type: "tween" },
              type: "spring",
            }}
          >
            <motion.div
              layout
              className="w-container absolute bottom-48 left-1/2 mx-auto flex h-full max-w-380 -translate-x-1/2 flex-col justify-end gap-3 overflow-clip px-4 py-2 lg:bottom-40"
              variants={{
                rest: {
                  opacity: 0,
                },
                hover: {
                  opacity: 1,
                },
              }}
            >
              <motion.div
                layout
                className="flex items-center gap-2 opacity-30"
                variants={{ infoShowing: { opacity: 0 } }}
                animate={showingInfo ? "infoShowing" : ""}
              >
                <motion.img
                  layout
                  className="w-full max-w-20 justify-self-start"
                  src={logoFullSVG}
                  alt=""
                />
                <motion.span layout>•</motion.span>

                <motion.button
                  className="allow-discrete flex cursor-pointer items-center gap-2 rounded-full bg-transparent px-3 py-0.5 ring ring-white transition-all duration-200 hover:bg-white hover:text-black"
                  onClick={() => {
                    muxVideo.isMuted ? muxVideo.unmute() : muxVideo.mute();
                  }}
                >
                  {muxVideo.isMuted ? (
                    <SpeakerSimpleSlashIcon className="text-sm" />
                  ) : (
                    <SpeakerSimpleHighIcon className="text-sm" />
                  )}
                  <motion.span className="text-xs tracking-widest uppercase">
                    {muxVideo.isMuted ? "Unmute" : "Mute"}
                  </motion.span>
                </motion.button>
              </motion.div>

              <AnimatePresence mode="popLayout">
                {videos.map(
                  (video) =>
                    video.videoID === activeVideo.videoID && (
                      <motion.span
                        layout
                        layoutId={`video-title-${video.videoID}`}
                        key={video.videoID}
                        initial={{
                          translateY: "-50%",
                          opacity: 0,
                          filter: "blur(5px)",
                        }}
                        animate={{
                          translateY: "0%",
                          opacity: 0.5,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          translateY: "50%",
                          opacity: 0,
                          filter: "blur(5px)",
                        }}
                        transition={{
                          layout: {
                            type: "spring",
                            bounceDamping: 20,
                            bounce: 0.2,
                          },
                        }}
                        className="text-3xl font-semibold opacity-30 lg:text-5xl"
                      >
                        {activeVideo.title || ""}
                      </motion.span>
                    ),
                )}
              </AnimatePresence>

              {!activeVideo.isBrandVideo && mode === "preview" && (
                <a
                  href={`/videos/${activeVideo.slug}`}
                  className="upper bvp-ui self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-black opacity-50 backdrop-blur-lg duration-200 hover:opacity-100"
                >
                  Watch Full Video
                </a>
              )}

              {mode === "full" && activeVideo.body && (
                <motion.div className="relative" initial="compact">
                  <motion.div
                    layout
                    layoutCrossfade
                    layoutId={`video-body`}
                    className="bvp-ui text-white/50"
                    dangerouslySetInnerHTML={{
                      __html: convertLexicalToHTML({ data: activeVideo.body }),
                    }}
                    variants={{
                      expanded: {
                        maxHeight: "100%",
                      },
                      compact: {
                        maxHeight: "3lh",
                        overflow: "hidden",
                        webkitLineClamp: 3,
                        display: "-webkit-box",
                        webkitBoxOrient: "vertical",
                      },
                    }}
                    transition={{
                      layout: {
                        type: "spring",
                        bounceDamping: 20,
                        bounce: 0.2,
                      },
                    }}
                  />
                  <motion.button
                    className="bvp-ui absolute right-0 bottom-0 h-1/3 cursor-pointer rounded bg-black/20 px-4 text-sm font-medium backdrop-blur-lg duration-300 hover:bg-black/40 active:bg-black"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowingInfo(true);
                    }}
                    variants={{
                      expanded: {
                        opacity: 0,
                      },
                      compact: {
                        opacity: 1,
                      },
                    }}
                  >
                    Read More
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </MotionConfig>

          <VideoList
            videos={videos}
            activeVideo={activeVideo}
            muxVideo={muxVideo}
            setActiveVideo={setActiveVideo}
            videoRef={ref}
          />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showingInfo && (
          <motion.div
            ref={infoRef}
            className="w-container fixed right-4 left-4 z-50 mt-auto ml-auto h-full max-h-1/2 max-w-200 rounded-2xl bg-black/60 text-white ring ring-white/10 backdrop-blur-2xl backdrop-brightness-150 backdrop-saturate-150 max-lg:top-4 max-lg:bottom-4 lg:top-1/2 lg:right-16 lg:max-h-[80vh] lg:-translate-y-1/2"
            initial={{
              translateX: "100%",
              opacity: 0,
              filter: "blur(5px)",
            }}
            animate={{
              translateX: "0%",
              opacity: 1,
              filter: "blur(0px)",
            }}
            exit={{
              translateX: "100%",
              opacity: 0,
              filter: "blur(5px)",
            }}
            transition={{ type: "spring", visualDuration: 0.5, bounce: 0.15 }}
          >
            <motion.div className="flex h-full flex-col overflow-y-auto rounded-2xl">
              <motion.span
                layout
                layoutId={`video-title-${activeVideo.videoID}`}
                className="text-shadow sticky top-0 z-20 rounded-2xl bg-linear-180 from-black to-transparent px-16 py-8 text-3xl font-semibold lg:pt-16 lg:text-5xl"
              >
                {activeVideo.title || ""}
              </motion.span>
              <motion.div
                layout
                layoutId={`video-body`}
                layoutCrossfade
                className="bvp-ui px-16 text-white"
                dangerouslySetInnerHTML={{
                  __html: convertLexicalToHTML({ data: activeVideo.body }),
                }}
                variants={{
                  expanded: {
                    maxHeight: "100%",
                  },
                  compact: {
                    maxHeight: "3lh",
                    overflow: "hidden",
                    webkitLineClamp: 3,
                    display: "-webkit-box",
                    webkitBoxOrient: "vertical",
                  },
                }}
              />

              <div className="flex flex-col flex-wrap gap-4 p-16">
                {activeVideo.type?.title || activeVideo.metadata ? (
                  <div className="mb-auto flex min-h-36 w-full flex-col gap-3 rounded-xl bg-neutral-200/10 p-6 ring-1 ring-white/15 md:w-72">
                    {activeVideo.type?.title && (
                      <div className="flex flex-col gap-3">
                        <span className="text-xs font-bold tracking-widest uppercase">
                          Category
                        </span>
                        <span>{activeVideo.type?.title}</span>
                      </div>
                    )}

                    {activeVideo.metadata &&
                      activeVideo.metadata.map(({ label, value }) => (
                        <div className="flex flex-col">
                          <span className="text-xxs text-accent-300 tracking-widest uppercase">
                            {label}
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: value }} />
                        </div>
                      ))}
                  </div>
                ) : null}

                {(activeVideo.awards?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap pt-8">
                    {activeVideo.awards!.map((awardImage) => (
                      <Image media={awardImage} width={150} alt="" />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BigVideoPlayerContext.Provider>
  );
}

function VideoList({
  videos,
  activeVideo,
  setActiveVideo,
  videoRef,
  muxVideo,
}: {
  videos: Populated<Video>[];
  activeVideo: Populated<Video>;
  setActiveVideo: (video: Populated<Video>) => void;
  videoRef: React.RefObject<MuxPlayerRefAttributes>;
  muxVideo: ReturnType<typeof useMuxVideo>;
}) {
  const { mode } = useContext(BigVideoPlayerContext);
  return (
    <motion.div
      className={cn(
        "no-scrollbar bvp-ui static mx-auto flex w-full max-w-390 snap-x snap-mandatory gap-4 overflow-x-auto py-6 xl:absolute xl:bottom-0 xl:left-1/2 xl:-translate-x-1/2",
        {
          "absolute bottom-0 max-w-full": mode === "full",
        },
      )}
      variants={{
        hover: {
          y: "0%",
        },
        rest: {
          y: "100%",
        },
      }}
      transition={{
        visualDuration: 0.5,
        type: "spring",
        bounce: 0.4,
        bounceDamping: 50,
      }}
    >
      <div className="w-32" />
      {videos?.map((video) => (
        <VideoListCard
          key={video.videoID}
          video={video}
          muxVideo={muxVideo}
          isActive={activeVideo.videoID === video.videoID}
          setActiveVideo={setActiveVideo}
          videoRef={videoRef}
          isBrandVideo={video.videoID === videos[0].videoID}
        />
      ))}
      <div className="w-16" />
    </motion.div>
  );
}

function VideoListCard({
  video,
  isBrandVideo,
  videoRef,
  setActiveVideo,
  isActive,
  muxVideo,
}: {
  isActive: boolean;
  video: Populated<Video>;
  isBrandVideo: boolean;
  videoRef: React.RefObject<MuxPlayerRefAttributes>;
  muxVideo: ReturnType<typeof useMuxVideo>;
  setActiveVideo: (video: Populated<Video>) => void;
}) {
  const activeVideoProgressAsStrokeOffset = useSpring(0, {
    bounce: 0.1,
    duration: 0.6,
    damping: 25,
  });
  const { mode } = useContext(BigVideoPlayerContext);
  const ref = useRef<HTMLDivElement>(null);
  const { height, width } = useResizeObserver({ ref });
  const { isPlaying, pause, play } = muxVideo;

  useEffect(() => {
    if (!isActive) {
      activeVideoProgressAsStrokeOffset.jump(0);
      return;
    }

    scrollIntoView(ref.current, {
      behavior: "smooth",
      block: "nearest",
      duration: 500,
      inline: "center",
      scrollMode: "if-needed",
      boundary: ref.current?.parentElement,
    });
  }, [isActive]);

  useEffect(() => {
    if (!videoRef.current) return;

    const onTimeUpdate = (e: Event) => {
      const target = e.currentTarget as HTMLVideoElement;

      const useFullDuration = isBrandVideo || mode === "full";

      const duration = useFullDuration ? target.duration : VIDEO_PLAY_DURATION;
      const currentTime = useFullDuration
        ? target.currentTime
        : target.currentTime - VIDEO_START_TIME;

      const progress = Math.max((currentTime + 0.5) / duration, 0.025);

      if (
        [duration, currentTime].some(
          (value) => isNaN(value) || !isFinite(value),
        )
      ) {
        activeVideoProgressAsStrokeOffset.set(0);
        return;
      }

      activeVideoProgressAsStrokeOffset.set(progress);
    };

    const videoElement = videoRef.current;
    videoElement.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      videoElement.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoRef.current, width, height]);

  return (
    <motion.div
      ref={ref}
      onClick={() => {
        if (isActive) {
          if (isPlaying) {
            pause();
          } else {
            play();
          }
        } else {
          setActiveVideo(video);
        }
      }}
      className={cn(
        "group relative flex aspect-video min-w-50 cursor-pointer flex-col rounded-xl duration-300 select-none hover:opacity-100",
      )}
    >
      <div className="absolute inset-0 z-1 size-full rounded-xl border border-white/10 backdrop-blur-3xl backdrop-brightness-75 backdrop-saturate-150" />

      {video.image && (
        <Image
          width={400}
          media={video.image}
          className={cn(
            "z-2 aspect-video w-full rounded-xl object-cover opacity-15 contrast-150 duration-300 group-hover:opacity-75",
            {
              "opacity-100 contrast-100": isActive,
            },
          )}
        />
      )}

      <motion.svg
        width={width + 2}
        height={height + 2}
        viewBox={`0 0 ${width} ${height}`}
        className={cn(
          "pointer-events-none absolute inset-0 z-3 -mt-px -ml-px",
          {
            hidden: !isActive,
          },
        )}
      >
        <motion.path
          d={`M 14 2 L ${width - 14} 2 Q ${width - 2} 2 ${width - 2} 14 L ${width - 2} ${height - 14} Q ${width - 2} ${height - 2} ${width - 14} ${height - 2} L 14 ${height - 2} Q 2 ${height - 2} 2 ${height - 14} L 2 14 Q 2 2 14 2 Z`}
          style={{ pathLength: activeVideoProgressAsStrokeOffset }}
          fill="none"
          stroke="#ffffff75"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="0 1"
        />
      </motion.svg>

      <div
        className={cn(
          "absolute bottom-1 left-2 z-3 flex flex-col gap-1 p-2 leading-5 font-medium opacity-20 duration-300 text-shadow-2xs group-hover:opacity-100 max-lg:text-sm",
          { "opacity-0": isActive },
        )}
      >
        <span>{video.title}</span>
      </div>

      <div
        className={cn(
          "absolute top-1/2 left-1/2 z-3 -translate-1/2 rounded-full opacity-0 backdrop-blur-sm duration-300",
          {
            "opacity-100": isActive,
          },
        )}
      >
        {isPlaying ? (
          <PauseCircleIcon size={40} weight="fill" />
        ) : (
          <PlayCircleIcon size={40} weight="fill" />
        )}
      </div>
    </motion.div>
  );
}

function VideoPlayer({
  video,
  isBrandVideo = false,
  onVideoEnd,
  ref,
  muxVideo,
}: {
  video: Populated<Video>;
  isBrandVideo: boolean;
  onVideoEnd?: () => void;
  muxVideo: ReturnType<typeof useMuxVideo>;
  ref?: React.RefObject<MuxPlayerRefAttributes>;
}) {
  const { mode } = useContext(BigVideoPlayerContext);
  const [isLowerPowerMode, setIsLowPowerMode] = useState(false);
  const { isPlaying, isMuted, play } = muxVideo;

  useEffect(() => {
    ref.current?.play().catch((error) => {
      if (error.name === "NotAllowedError") {
        setIsLowPowerMode(true);
      }
    });
  }, [ref]);

  return (
    <motion.div
      className={cn(
        "relative size-full overflow-clip duration-2000 [--controls:none]",
        {
          "h-dvh max-h-dvh": mode === "full",
          "aspect-3/4 max-h-[80vh] lg:aspect-[2256/943.195]":
            mode === "preview",
        },
      )}
    >
      <MuxPlayer
        className={cx("size-full overflow-clip object-cover object-center", {
          hidden: isLowerPowerMode,
          "scale-125 lg:scale-100": video.hasCropMarks,
          "h-dvh max-h-dvh 2xl:[--media-object-fit:cover]": mode === "full",
          "aspect-3/4 [--controls:none] [--media-object-fit:cover] lg:aspect-[2256/943.195] lg:max-h-[80vh]":
            mode === "preview",
        })}
        ref={ref}
        src={video.videom3u8 || video.videoURL}
        autoPlay
        preload="auto"
        muted={isMuted}
        paused={!isPlaying}
        defaultHiddenCaptions
        onEnded={() => {
          if (isBrandVideo || mode === "full") {
            onVideoEnd?.();
          }
        }}
        onPlay={(e) => {
          if (isBrandVideo || mode === "full") return;
          const target = e.currentTarget as HTMLVideoElement;

          if (target.currentTime < VIDEO_START_TIME) {
            target.currentTime = VIDEO_START_TIME;
          }
        }}
        onTimeUpdate={(e) => {
          if (isBrandVideo || mode === "full") return;

          const target = e.currentTarget as HTMLVideoElement;
          if (target.currentTime > VIDEO_START_TIME + VIDEO_PLAY_DURATION) {
            onVideoEnd?.();
          }
        }}
        playsInline
      />
    </motion.div>
  );
}
