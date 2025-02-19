import { Play, Pause, VolumeX, Volume2 } from "lucide-react"
import cx from "classnames"
import config from "../home.json"
import { useEffect, useRef, useState } from "react"
import { useVideo } from "../hooks/useVideo"
import heroVideoImage from "../images/tempHero.jpg?url"

const buttonClasses = `size-3 lg:size-4 rounded-lg lg:rounded-xl py-3 px-4 box-content duration-200 fill-white bg-background/65 hover:bg-background/95 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/10`

export default function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null)
  const [isLowerPowerMode, setIsLowPowerMode] = useState(false)
  const { play, pause, isPlaying, isMuted, mute, unmute } = useVideo(video)

  useEffect(() => {
    video.current?.play().catch((error) => {
      if (error.name === "NotAllowedError") {
        setIsLowPowerMode(true)
      }
    })
  }, [video])

  return (
    <div className="mx-auto w-container">
      <div className="rounded-3 relative max-h-[80vh] overflow-hidden shadow-lg duration-200 lg:shadow-2xl">
        <video
          ref={video}
          className={cx(
            "size-full max-h-[80vh] rounded-xl border-0.5 border-white/10 object-cover object-center",
            {
              hidden: isLowerPowerMode,
            },
          )}
          src={config.hero.videoUrl}
          autoPlay
          preload="auto"
          muted={isMuted}
          loop
          playsInline
        />
        {isLowerPowerMode && (
          <img
            src={heroVideoImage}
            className="size-full max-h-[80vh] rounded-xl border-0.5 border-white/10 object-cover object-center"
          />
        )}

        {!isLowerPowerMode && (
          <div className="absolute right-2 top-2 flex gap-3 lg:right-8 lg:top-8">
            {isMuted ? (
              <button onClick={unmute}>
                <VolumeX className={buttonClasses} />
                <span className="sr-only">Turn volume on</span>
              </button>
            ) : (
              <button onClick={mute}>
                <Volume2 className={buttonClasses} />
                <span className="sr-only">Turn volume off</span>
              </button>
            )}

            {isPlaying ? (
              <button onClick={pause}>
                <Pause className={buttonClasses} />
                <span className="sr-only">Pause video</span>
              </button>
            ) : (
              <button onClick={play}>
                <Play className={buttonClasses} />
                <span className="sr-only">Play video</span>
              </button>
            )}
          </div>
        )}
        <div className="static bottom-8 right-8 rounded-lg bg-background/65 px-6 py-4 text-sm font-medium leading-normal shadow-lg ring-1 ring-white/10 lg:absolute lg:max-w-3xl lg:rounded-2xl lg:border-none lg:px-8 lg:py-6 lg:text-lg lg:shadow-none lg:backdrop-blur-xl">
          {config.HERO_EXCERPT}
        </div>
      </div>
    </div>
  )
}
