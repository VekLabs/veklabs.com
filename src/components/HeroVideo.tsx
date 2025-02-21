import cx from "classnames"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import config from "../content/home.json"
import { useVideo } from "../hooks/useVideo"
import { globalOpenVideo } from "../hooks/useVideoOpenState"
import heroVideoImage from "../images/tempHero.jpg?url"

const buttonClasses = `size-3 lg:size-4 rounded-lg lg:rounded-xl py-3 px-4 box-content duration-200 fill-white bg-background/65 hover:bg-background/95 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/10`

export default function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null)
  const [isLowerPowerMode, setIsLowPowerMode] = useState(false)
  const { play, pause, isPlaying, isMuted, mute, unmute } = useVideo(video)
  const videoPlayerIsOpen = !!globalOpenVideo.value

  useEffect(() => {
    video.current?.play().catch((error) => {
      if (error.name === "NotAllowedError") {
        setIsLowPowerMode(true)
      }
    })
  }, [video])

  useEffect(() => {
    if (videoPlayerIsOpen) {
      pause()
    } else {
      play()
    }
  }, [videoPlayerIsOpen])

  return (
    <div className="w-container mx-auto">
      <div className="rounded-3 relative max-h-[80vh] overflow-hidden shadow-lg duration-200 lg:shadow-2xl">
        <video
          ref={video}
          className={cx(
            "border-0.5 size-full max-h-[80vh] rounded-xl border-white/10 object-cover object-center",
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
            className="border-0.5 size-full max-h-[80vh] rounded-xl border-white/10 object-cover object-center"
          />
        )}

        {!isLowerPowerMode && (
          <div className="absolute top-2 right-2 flex gap-3 lg:top-8 lg:right-8">
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
        <div className="bg-background/65 static right-8 bottom-8 mt-4 rounded-lg px-6 py-4 text-sm leading-normal font-medium ring-1 shadow-lg ring-white/10 lg:absolute lg:mt-0 lg:max-w-3xl lg:rounded-2xl lg:border-none lg:px-8 lg:py-6 lg:text-lg lg:shadow-none lg:backdrop-blur-xl">
          {config.HERO_EXCERPT}
        </div>
      </div>
    </div>
  )
}
