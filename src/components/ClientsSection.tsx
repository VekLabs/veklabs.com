import { chunk } from "lodash-es"
import { AnimatePresence, motion, steps } from "motion/react"
import { useState } from "react"
import { useInterval } from "usehooks-ts"
import config from "../content/home.json"
import { ChevronRight } from "lucide-react"

const logos = Object.values(
  import.meta.glob("/src/images/logos/*", { eager: true }),
).map((file) => (file as { default: { src: string } }).default)

const chunkSize = 6
const logoChunks = chunk(logos, chunkSize).map((chunk, i, chunks) => {
  if (chunk.length < chunkSize) {
    const diff = chunkSize - chunk.length
    const fill = chunks[i - 1].slice(0, diff)
    return chunk.concat(fill)
  }
  return chunk
})

const easing = steps(chunkSize)

export function ClientsSection() {
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)

  useInterval(() => {
    setCurrentChunkIndex((prev) => (prev + 1) % logoChunks.length)
  }, 3000)

  return (
    <section className="w-container mx-auto py-8 text-center md:pt-12 md:pb-20">
      <div className="flex flex-col items-center gap-4">
        <h1 className="m-0 text-3xl font-medium tracking-widest">
          {config.CLIENT_TITLE}
        </h1>
        <div className="flex flex-col items-center gap-8">
          <h4 className="m-0 text-xl font-light">{config.CLIENT_SUB_TITLE}</h4>
          <a
            className="mt-1 flex items-center justify-between gap-1.5 rounded-full bg-white/20 px-5 py-2"
            href="/clients"
            title="All Clients"
          >
            <span>All Clients</span>
            <ChevronRight className="-mr-2 size-[1_cap]" />
          </a>
        </div>
      </div>

      <div className="relative container mx-auto py-6 pt-10">
        <motion.div className="relative mx-auto grid h-60 w-full max-w-3xl grid-cols-3 grid-rows-2 place-items-center">
          <AnimatePresence mode="popLayout">
            {logoChunks[currentChunkIndex].map((logo, i) => (
              <motion.img
                key={logo.src}
                initial={{ filter: "blur(10px)", opacity: 0, scale: 0.25 }}
                animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
                exit={{ filter: "blur(10px)", opacity: 0, scale: 0.25 }}
                transition={{ delay: easing(i * 0.1) }}
                className="w-16 md:block md:w-36"
                loading="lazy"
                src={logo.src}
                alt=""
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
