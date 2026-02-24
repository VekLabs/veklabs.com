import { useMuxVideo } from "@/hooks/useVideo";
import heroVideoImage from "@/images/tempHero.jpg";
import type { HomePage } from "@/payload-types";
import type { Populated } from "@/utils/typeChecks";
import VideoPlayer, {
  type MuxPlayerRefAttributes,
} from "@mux/mux-player-react";
import {
  PauseIcon,
  PlayIcon,
  SpeakerSimpleHighIcon,
  SpeakerSimpleSlashIcon,
} from "@phosphor-icons/react/ssr";
import cx from "classnames";
import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "./Image";

const buttonClasses = `size-3 lg:size-4 rounded-lg lg:rounded-xl py-3 px-4 box-content duration-200 fill-white bg-background/65 hover:bg-background/95 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/10`;

export default function HeroVideo({ config }: { config: Populated<HomePage> }) {
  const [isLowerPowerMode, setIsLowPowerMode] = useState(false);
  const video = useRef<MuxPlayerRefAttributes>(null);
  const { play, pause, isPlaying, isMuted, mute, unmute } = useMuxVideo(video);

  useEffect(() => {
    video.current?.play().catch((error) => {
      if (error.name === "NotAllowedError") {
        setIsLowPowerMode(true);
      }
    });
  }, [video]);

  return (
    <div className="w-container mx-auto">
      <div className="rounded-3 relative aspect-[2256/943.195] max-h-[80vh] w-full overflow-hidden shadow-lg duration-200 lg:shadow-2xl">
        <VideoPlayer
          className={cx(
            "rounded-3 border-0.5 aspect-[2256/943.195] size-full max-h-[80vh] w-full overflow-hidden rounded-xl border-white/10 object-cover object-center [--controls:none] [--media-object-fit:cover]",
            {
              hidden: isLowerPowerMode,
            },
          )}
          ref={video}
          src={config.hero.videom3u8 || config.hero.videoURL}
          poster={getImageUrl({
            media: config.hero.image,
            alt: "",
            width: 1000,
            height: 418,
          })}
          autoPlay
          preload="auto"
          muted={isMuted}
          paused={!isPlaying}
          loop
          playsInline
        />

        <noscript>
          <video
            className={cx(
              "rounded-3 border-0.5 aspect-[2256/943.195] size-full max-h-[80vh] w-full overflow-hidden rounded-xl border-white/10 object-cover object-center [--controls:none] [--media-object-fit:cover]",
              {
                hidden: isLowerPowerMode,
              },
            )}
            controls={false}
            src={config.hero.videoURL}
            autoPlay
            preload="auto"
            muted={isMuted}
            loop
            playsInline
          />
        </noscript>

        {isLowerPowerMode && (
          <img
            src={heroVideoImage.src}
            alt=""
            className="border-0.5 size-full max-h-[80vh] rounded-xl border-white/10 object-cover object-center"
          />
        )}

        {!isLowerPowerMode && (
          <div className="absolute top-2 right-2 flex gap-3 lg:top-8 lg:right-8">
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
        )}
        <h2 className="bg-background/65 static right-8 bottom-8 mt-4 rounded-lg px-6 py-4 text-sm leading-normal font-medium shadow-lg ring-1 ring-white/10 lg:absolute lg:mt-0 lg:max-w-3xl lg:rounded-2xl lg:border-none lg:px-8 lg:py-6 lg:text-lg lg:shadow-none lg:backdrop-blur-xl">
          {config.hero.HERO_EXCERPT}
        </h2>
      </div>
    </div>
  );
}
