import { useMuxVideo } from '@/hooks/useVideo'
import type { Video } from '@/payload-types'
import { cn } from '@/utils/cn'
import { isMedia, type Populated } from '@/utils/typeChecks'
import { type MuxPlayerRefAttributes } from '@mux/mux-player-react'
import MuxPlayer from '@mux/mux-player-react/lazy'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import Image, { getImageUrl } from './Image'

export default function VideoCard({
  video,
  className,
  showYear = false,
}: {
  video: Populated<Video>
  className?: string
  showYear?: boolean
}) {
  const ref = useRef<MuxPlayerRefAttributes>(null)
  const { play, pause, isPlaying } = useMuxVideo(ref)
  const [currentTime, setCurrentTime] = useState(30)
  const image = isMedia(video.image) ? video.image : null

  useEffect(() => {
    const videoElement = ref.current
    const onPlay = (e: Event) => {
      const target = e.currentTarget as HTMLVideoElement
      target.currentTime = 30
    }
    const onTimeUpdate = (e: Event) => {
      const target = e.currentTarget as HTMLVideoElement
      if (target.currentTime > 40) target.currentTime = 30
    }

    if (videoElement) {
      videoElement.addEventListener('play', onPlay)
      videoElement.addEventListener('timeupdate', onTimeUpdate)
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('play', onPlay)
        videoElement.removeEventListener('timeupdate', onTimeUpdate)
      }
    }
  }, [ref])

  return (
    <motion.a
      layout
      layoutId={`video-${video.slug}`}
      href={`/videos/${video.slug}`}
      className={cn([
        'group relative aspect-video size-full max-w-full cursor-pointer snap-start scroll-mx-6 rounded-xl border-neutral-300',
        className,
      ])}
      data-category={video.type.slug}
      onMouseOver={play}
      onMouseLeave={pause}
    >
      <div className="contain-inline-size w-full spring-duration-700 spring-bounce-40 absolute bottom-3 left-2.5 isolate z-10 flex max-w-[calc(100%-30px)] flex-col group-hover:bottom-2.5 group-hover:left-3.5 lg:bottom-9 lg:left-6 lg:group-hover:bottom-6 lg:group-hover:left-6">
        <span className="text-xxs line-clamp-1 inline-flex w-full items-center tracking-widest uppercase duration-200 group-hover:opacity-50 md:text-xs">
          {typeof video.type !== 'number' && 'title' in video.type && (
            <span className="mr-2 inline-flex gap-2 overflow-clip tracking-widest whitespace-nowrap uppercase">
              {video.type.title}
            </span>
          )}
          {showYear && video.publishDate && (
            <span className="mr-2 inline-flex gap-2 overflow-clip tracking-widest whitespace-nowrap uppercase">
              {new Date(video.publishDate).getFullYear()}
            </span>
          )}
          <div className="hidden size-full overflow-hidden md:block">
            <span className="spring-duration-1000 spring-bounce-20 inline-flex -translate-x-full items-center opacity-0 delay-200 group-hover:translate-x-0 group-hover:opacity-100">
              Learn More
              <ArrowRightIcon className="ml-1 size-3" />
            </span>
          </div>
        </span>
        <span className="text-md pointer-events-none line-clamp-1 overflow-clip flex items-center font-semibold text-ellipsis whitespace-nowrap text-shadow-lg sm:text-xl w-full overflow-gradient-mask">
          {video.title}
        </span>
      </div>

      <MuxPlayer
        ref={ref}
        className="size-full overflow-hidden rounded-xl object-cover opacity-0 duration-700 [--controls:none] [--media-object-fit:cover] group-hover:opacity-100"
        src={video.videom3u8 || video.previewURL}
        poster={getImageUrl({
          alt: '',
          media: image,
          height: 500 / (16 / 9),
          width: 500,
        })}
        preload="auto"
        muted
        paused={!isPlaying}
        currentTime={currentTime}
        onTimeUpdate={(e) => {
          const target = e.currentTarget as HTMLVideoElement
          if (target.currentTime > 40) {
            setCurrentTime(30)
          }
        }}
        onPlay={(e) => {
          const target = e.currentTarget as HTMLVideoElement
          target.currentTime = 30
        }}
        playsInline
        loop
      />

      <div className="absolute inset-0 aspect-video size-full overflow-hidden rounded-xl object-cover opacity-100 duration-700 group-hover:opacity-0">
        {isMedia(video.image) && (
          <Image
            media={video.image}
            loading="lazy"
            // width={500}
            alt=""
            className="w-full object-cover"
          />
        )}
      </div>
    </motion.a>
  )
}
