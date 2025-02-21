import {
  FloatingOverlay,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react"
import type { CollectionEntry } from "astro:content"
import { AnimatePresence, motion, MotionConfig } from "motion/react"
import { kebabCase } from "lodash-es"
import { useState, type ComponentProps } from "react"
import { cn } from "../utils/cn"

type Props = CollectionEntry<"team">

function CrewImage({
  id,
  src,
  width,
  height,
  alt,
  full = false,
}: ComponentProps<"img"> & { full?: boolean }) {
  return (
    <motion.img
      layoutId={id}
      src={src}
      width={width}
      height={height}
      decoding="async"
      loading="lazy"
      alt={alt}
      className={cn(
        "aspect-square w-20 cursor-pointer rounded-full object-cover ring-1 shadow-2xl ring-gray-50/10 md:w-40 lg:w-52",
        { "w-40 lg:w-52": full },
      )}
    />
  )
}

const MotionOverlay = motion.create(FloatingOverlay)

export default function CrewComponent(member: Props) {
  const id = kebabCase(member.data.name)
  const listFormatter = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  })
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const { refs, context } = useFloating({
    open: modalIsOpen,
    onOpenChange: setModalIsOpen,
  })

  const dismiss = useDismiss(context, { ancestorScroll: true })

  const { getFloatingProps } = useInteractions([dismiss])

  return (
    <MotionConfig transition={{ type: "spring", bounce: 0.2 }}>
      <motion.div
        layoutId={id + "container"}
        className="group relative flex w-full min-w-20 snap-center items-center gap-6 py-0.5 md:w-auto md:min-w-36 md:snap-start md:flex-col md:py-10"
        onClick={() => setModalIsOpen(true)}
      >
        <CrewImage
          id={id + "image"}
          src={member.data.image.src}
          alt={member.data.name}
        />
        <motion.div
          layoutId={id + "text"}
          className="center flex flex-col gap-2 md:text-center"
        >
          <motion.h3
            layoutId={id + "name-title"}
            className="m-0 font-bold uppercase"
          >
            {member.data.name}
          </motion.h3>
          <motion.p
            layoutId={id + "competencies"}
            className="text-accent-400 max-w-52 text-sm break-words"
          >
            {listFormatter.format(member.data.competencies)}
          </motion.p>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {modalIsOpen ? (
          <MotionOverlay
            id="crew-popup"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-0 left-0 z-50 flex h-screen min-h-screen w-screen items-center justify-center overscroll-contain bg-black/30 backdrop-blur-lg"
          >
            <motion.div
              {...getFloatingProps()}
              layoutId={id + "container"}
              ref={refs.setFloating}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-container my-0 flex max-w-[800px] flex-wrap items-center justify-center gap-8 p-10 text-center text-lg font-medium text-white md:flex-nowrap md:justify-start md:text-start"
            >
              <CrewImage
                full
                id={id + "image"}
                src={member.data.image.src}
                alt={member.data.name}
              />

              <motion.div
                layoutId={id + "text"}
                className="center flex w-full grow flex-col gap-2 self-start py-8 text-start"
              >
                <motion.h3
                  layoutId={id + "name-title"}
                  className="m-0 text-2xl font-bold uppercase"
                >
                  {member.data.name}
                </motion.h3>
                <motion.p
                  layoutId={id + "competencies"}
                  className="text-accent-400 text-sm"
                >
                  {listFormatter.format(member.data.competencies)}
                </motion.p>
                <motion.p className="max-w-prose text-sm font-normal text-gray-200">
                  {member.body}
                </motion.p>
              </motion.div>
            </motion.div>
          </MotionOverlay>
        ) : null}
      </AnimatePresence>
    </MotionConfig>
  )
}
