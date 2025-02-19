import {
  FloatingOverlay,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react"
import { useSessionStorage } from "@uidotdev/usehooks"
import { AnimatePresence, motion } from "motion/react"
import { type Ref } from "react"
import { POPUP_DURATION, type VideoData } from "./videoConstants"
import { useHistory } from "../hooks/useHistory"
import { snakeCase } from "lodash-es"
import { useVideoOpenState } from "../hooks/useVideoOpenState"
import classNames from "classnames"

type VideoInformationPopupProps = VideoData & {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  ref: Ref<HTMLDivElement>
  nextVideo?: VideoData
  prevVideo?: VideoData
}

export function VideoInformationPopup({
  videoURL,
  meta,
  image,
  title,
  body,
  type,
  nextVideo,
  prevVideo,
  onOpenChange,
  ref,
}: VideoInformationPopupProps) {
  const [playTime] = useSessionStorage(videoURL, "0")
  const { refs, context } = useFloating({
    open: true,
    onOpenChange,
  })

  const history = useHistory()

  const dismiss = useDismiss(context)

  const { getFloatingProps } = useInteractions([dismiss])

  return (
    <motion.div
      className="h-full overflow-y-scroll bg-neutral-950/70 backdrop-blur-3xl backdrop-brightness-200 backdrop-saturate-200"
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{
        opacity: 1,
        backdropFilter: "blur(64px)",
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      transition={{ duration: POPUP_DURATION, type: "spring" }}
      ref={refs.setFloating}
      {...getFloatingProps()}
    >
      <motion.div className="grid w-full grid-cols-[1fr_auto_1fr]">
        <div />
        <motion.div className="relative mx-auto w-container max-w-7xl md:p-10">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: POPUP_DURATION, duration: POPUP_DURATION }}
            src={image.src}
            className="absolute scale-150 blur-2xl brightness-150 saturate-150 md:-m-5"
          />
          <motion.video
            layoutId={`video-${title}`}
            controls
            onPlay={(e) => {
              if (
                e.currentTarget &&
                playTime &&
                e.currentTarget.currentTime < 2
              ) {
                e.currentTarget.currentTime = +playTime
              }
            }}
            onTimeUpdate={(e) => {
              if (e.currentTarget) {
                sessionStorage.setItem(
                  videoURL,
                  `${e.currentTarget.currentTime}`,
                )
              }
            }}
            className="absolute aspect-video rounded-xl object-cover shadow-lg shadow-neutral-950 ring-2 ring-white/5 md:w-[calc(100%-5rem)]"
            src={videoURL}
            poster={image.src}
            transition={{
              duration: POPUP_DURATION / 2,
              layout: { type: "spring", duration: POPUP_DURATION },
            }}
            preload="none"
            autoPlay
            playsInline
            onLayoutAnimationComplete={() => {}}
            onError={(e) => console.error(e)}
          />
          <motion.div className="mb-20 aspect-video w-full" />
          <motion.span
            className="pointer-events-none absolute z-50 flex h-5 items-center text-2xl font-semibold shadow-neutral-950 text-shadow-lg"
            layoutId={`video-title-${title}`}
            transition={{
              duration: POPUP_DURATION / 2,
              type: "spring",
              layout: { duration: POPUP_DURATION / 2 },
            }}
            layout="preserve-aspect"
          >
            {title}
          </motion.span>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{
              delay: POPUP_DURATION - POPUP_DURATION / 5,
              type: "spring",
              bounce: 0.35,
              duration: POPUP_DURATION * 2,
              opacity: {
                type: "tween",
                duration: POPUP_DURATION * 2,
                delay: POPUP_DURATION - POPUP_DURATION / 5,
              },
            }}
            className="flex flex-col gap-6 pt-14"
          >
            <div className="flex justify-between gap-5">
              <div className="flex max-w-prose flex-col gap-3">
                {body && (
                  <>
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Description
                    </span>
                    <p>{body}</p>
                  </>
                )}
              </div>
              {type || meta ? (
                <div className="mb-auto flex min-h-36 w-56 flex-col gap-3 rounded-xl bg-neutral-200/10 p-6 ring-1 ring-white/15 md:w-72">
                  {type && (
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Category
                      </span>
                      <span>{type}</span>
                    </div>
                  )}
                  {meta &&
                    Object.entries(meta as Record<string, string>).map(
                      ([key, value]) => (
                        <motion.div
                          key={key}
                          className="flex flex-col"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1 },
                          }}
                        >
                          <span className="text-xxs uppercase tracking-widest text-accent-300">
                            {key}
                          </span>
                          <span>{value}</span>
                        </motion.div>
                      ),
                    )}
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
        <div />
      </motion.div>
    </motion.div>
  )
}
