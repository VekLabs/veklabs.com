import { useMuxVideo } from "@/hooks/useVideo";
import type { HomePage, Video } from "@/payload-types";
import { cn } from "@/utils/cn";
import type { Populated } from "@/utils/typeChecks";
import MuxPlayer, { type MuxPlayerRefAttributes } from "@mux/mux-player-react";
import {
  ArrowUpRightIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@phosphor-icons/react/ssr";
import cx from "classnames";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";
import logoFullSVG from "../images/logo-full.svg?url";
import scrollIntoView from "smooth-scroll-into-view-if-needed";
import { FigText } from "./FigText";
import Image from "./Image";

const VIDEO_PLAY_DURATION = 20;
const VIDEO_START_TIME = 30;

export default function HeroVideo({ config }: { config: Populated<HomePage> }) {
  const videos = [config.hero, ...config.hero.videos] as Populated<Video>[];
  const [activeVideo, setActiveVideo] = useState(videos?.[0] || null);
  const ref = useRef<MuxPlayerRefAttributes>(null);
  const muxVideo = useMuxVideo(ref);

  return (
    <>
      <div className="relative">
        <VideoPlayer
          video={activeVideo}
          muxVideo={muxVideo}
          ref={ref}
          isBrandVideo={activeVideo.videoID === config.hero.videoID}
          onVideoEnd={() => {
            const indexOfActiveVideo = videos.findIndex(
              (video) => video.id === activeVideo.id,
            );
            const nextVideo = videos[indexOfActiveVideo + 1] || videos[0];
            setActiveVideo(nextVideo);
          }}
        />

        {/* TODO: Hide when the logo comes in on the brand video */}
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
          >
            <motion.div layout className="flex gap-2 opacity-30">
              <motion.img
                layout
                className="w-full max-w-20 justify-self-start"
                src={logoFullSVG}
                alt=""
              />
              <motion.span layout>•</motion.span>
              <motion.span layout className="tracking-widest uppercase">
                Now Playing
              </motion.span>
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
                      className="text-3xl font-semibold opacity-30 lg:text-5xl"
                    >
                      {activeVideo.title || ""}
                    </motion.span>
                  ),
              )}
            </AnimatePresence>

            {activeVideo.videoID !== config.hero.videoID && (
              <a
                href={`/videos/${activeVideo.slug}`}
                className="upper self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-black opacity-50 backdrop-blur-lg duration-200 hover:opacity-100"
              >
                Watch Full Video
              </a>
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
      </div>

      <div className="w-container mx-auto flex max-w-370 flex-col pt-16 xl:flex-row">
        <div className="bg-stripes-diagonal relative flex basis-2/3 flex-col gap-3 border border-gray-900 p-6 px-8">
          <FigText className="absolute right-6 bottom-3 text-gray-700">
            FIG. 1.0
          </FigText>
          <span className="leading-11 font-medium lg:text-xl">
            {config.hero.HERO_EXCERPT}
          </span>
        </div>

        <motion.div
          className="w-full basis-1/3 overflow-clip border border-gray-800"
          whileHover="hovered"
        >
          <MotionConfig
            transition={{
              type: "spring",
              bounce: 0.3,
              bounceDamping: 20,
              visualDuration: 0.3,
            }}
          >
            <motion.a
              className="relative flex h-full w-full cursor-pointer items-center py-10 text-2xl font-medium"
              href="/portfolio"
            >
              <motion.div
                className="absolute inset-0 flex size-full items-center px-10"
                variants={{
                  hovered: { translateY: "-100%" },
                }}
                initial={{ translateY: "0%" }}
              >
                <motion.span
                  className="origin-bottom-left"
                  initial={{ rotateZ: 0, translateY: "0%" }}
                  variants={{
                    hovered: { rotateZ: -10, translateY: "-100%" },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.1,
                  }}
                >
                  Portfolio
                </motion.span>
                <ArrowUpRightIcon className="ml-auto" />
              </motion.div>

              <motion.div
                className="absolute inset-0 flex size-full items-center bg-white px-10 text-black"
                initial={{ translateY: "100%" }}
                variants={{ hovered: { translateY: "0%" } }}
              >
                <motion.span
                  className="z-10 origin-bottom-left text-black"
                  initial={{ translateY: "100%", rotateZ: 10 }}
                  variants={{ hovered: { translateY: "0%", rotateZ: 0 } }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.1,
                  }}
                >
                  Portfolio
                </motion.span>
                <ArrowUpRightIcon className="ml-auto" />
              </motion.div>
            </motion.a>
          </MotionConfig>
        </motion.div>
      </div>
    </>
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
  return (
    <div className="no-scrollbar static mx-auto flex w-full max-w-390 snap-x snap-mandatory gap-4 overflow-x-auto py-6 xl:absolute xl:bottom-0 xl:left-1/2 xl:-translate-x-1/2">
      <div className="w-32" />
      {videos?.map((video) => (
        <VideoListCard
          key={video.id}
          video={video}
          muxVideo={muxVideo}
          isActive={activeVideo.id === video.id}
          setActiveVideo={setActiveVideo}
          videoRef={videoRef}
          isBrandVideo={video.videoID === videos[0].videoID}
        />
      ))}
      <div className="w-16" />
    </div>
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

      const duration = isBrandVideo ? target.duration : VIDEO_PLAY_DURATION;
      const currentTime = isBrandVideo
        ? target.currentTime
        : target.currentTime - VIDEO_START_TIME;

      const progress = Math.min((currentTime + 0.5) / duration, 1);

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

  const opacity = useTransform(
    activeVideoProgressAsStrokeOffset,
    [0, 0.1, 1],
    [0, 1, 1],
  );

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
        style={{ opacity }}
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
  isBrandVideo = true,
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
  const [isLowerPowerMode, setIsLowPowerMode] = useState(false);
  const { isPlaying, isMuted, mute, pause, play, unmute } = muxVideo;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    ref.current?.play().catch((error) => {
      if (error.name === "NotAllowedError") {
        setIsLowPowerMode(true);
      }
    });
  }, [ref]);

  useEffect(() => {
    setIsReady(false);
  }, [video.videoID]);

  return (
    <motion.div
      className={cn(
        "relative aspect-3/4 size-full max-h-[80vh] overflow-clip opacity-0 duration-2000 lg:aspect-[2256/943.195]",
        {
          "opacity-100": isReady,
        },
      )}
    >
      <MuxPlayer
        className={cx(
          "aspect-3/4 h-full w-full overflow-clip border-white/10 object-cover object-center [--controls:none] [--media-object-fit:cover] lg:aspect-[2256/943.195] lg:max-h-[80vh]",
          {
            hidden: isLowerPowerMode,
            "scale-125 lg:scale-100": video.hasCropMarks,
          },
        )}
        ref={ref}
        src={video.videom3u8 || video.videoURL}
        onCanPlay={() => {
          play();
          setIsReady(true);
        }}
        autoPlay
        preload="auto"
        muted={isMuted}
        paused={!isPlaying}
        defaultHiddenCaptions
        onEnded={() => {
          if (isBrandVideo) {
            onVideoEnd?.();
          }
        }}
        onPlay={(e) => {
          if (isBrandVideo) return;
          const target = e.currentTarget as HTMLVideoElement;
          if (target.currentTime < VIDEO_START_TIME) {
            target.currentTime = VIDEO_START_TIME;
          }
        }}
        onTimeUpdate={(e) => {
          if (isBrandVideo) return;

          const target = e.currentTarget as HTMLVideoElement;
          if (target.currentTime > VIDEO_START_TIME + VIDEO_PLAY_DURATION) {
            onVideoEnd?.();
          }
        }}
        playsInline
      />
      <noscript>
        <video
          className={cx(
            "aspect-3/4 size-full max-h-[80vh] w-full overflow-hidden border-white/10 object-cover object-center [--controls:none] [--media-object-fit:cover] lg:aspect-[2256/943.195]",
            {
              hidden: isLowerPowerMode,
            },
          )}
          controls={false}
          src={video.videoURL}
          autoPlay
          preload="auto"
          muted={isMuted}
          loop
          playsInline
        />
      </noscript>
      {/* {isLowerPowerMode && (
        <img
          src={heroVideoImage.src}
          alt=""
          className="border-0.5 size-full max-h-[80vh] border-white/10 object-cover object-center"
        />
      )}
      {!isLowerPowerMode && (
        <div className="absolute right-3 bottom-4 flex gap-2 lg:right-8 lg:bottom-8">
          {isMuted ? (
            <button onClick={unmute}>
              <SpeakerSimpleSlashIcon className={buttonClasses} />
              <span className="sr-only">Turn volume on</span>
            </button>
          ) : (
            <button onClick={mute}>
              <SpeakerSimpleHighIcon className={buttonClasses} />
              <span className="sr-only">Turn volume off</span>
            </button>
          )}

          {isPlaying ? (
            <button onClick={pause}>
              <PauseIcon className={buttonClasses} />
              <span className="sr-only">Pause video</span>
            </button>
          ) : (
            <button onClick={play}>
              <PlayIcon className={buttonClasses} />
              <span className="sr-only">Play video</span>
            </button>
          )}
        </div>
      )} */}
      {/* <h2 className="bg-background/65 static right-8 bottom-8 mt-4 rounded-lg px-6 py-4 text-sm leading-normal font-medium shadow-lg ring-1 ring-white/10 lg:absolute lg:mt-0 lg:max-w-3xl lg:rounded-2xl lg:border-none lg:px-8 lg:py-6 lg:text-lg lg:shadow-none lg:backdrop-blur-xl">
          {config.hero.HERO_EXCERPT}
        </h2> */}
    </motion.div>
  );
}
