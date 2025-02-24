import type { CollectionEntry } from "astro:content"
import VideoCard from "./VideoCardReact"
import { useMemo, useState } from "react"
import classNames from "classnames"
import { AnimatePresence } from "motion/react"

export interface PortfolioGridProps {
  videos: CollectionEntry<"videos">[]
}

const categoryColors = [
  "ring-red-300 bg-red-400/20 hover:bg-red-400/50 data-[active=true]:bg-red-400/50 data-[active=true]:ring-2",
  "ring-blue-300 bg-blue-400/20 hover:bg-blue-400/50 data-[active=true]:bg-blue-400/50 data-[active=true]:ring-2",
  "ring-green-300 bg-green-400/20 hover:bg-green-400/50 data-[active=true]:bg-green-400/50 data-[active=true]:ring-2",
  "ring-yellow-300 bg-yellow-400/20 hover:bg-yellow-400/50 data-[active=true]:bg-yellow-400/50 data-[active=true]:ring-2",
  "ring-purple-300 bg-purple-400/20 hover:bg-purple-400/50 data-[active=true]:bg-purple-400/50 data-[active=true]:ring-2",
  "ring-pink-300 bg-pink-400/20 hover:bg-pink-400/50 data-[active=true]:bg-pink-400/50 data-[active=true]:ring-2",
]

const getCategoryColor = (category: string) => {
  const hash = category
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return categoryColors[hash % categoryColors.length]
}

export function PortfolioGrid({ videos }: PortfolioGridProps) {
  const filters = useMemo(() => {
    const type = videos.map((video) => video.data.type)
    return { type: [...new Set(type)] }
  }, [videos])

  const [filtersState, setFiltersState] = useState<
    Partial<
      Record<
        keyof typeof filters,
        (typeof filters)[keyof typeof filters][number]
      >
    >
  >({})

  return (
    <div className="flex w-full flex-col gap-8">
      {Object.entries(filters).map(([key, values]) => (
        <div
          key={key}
          className="no-scrollbar flex w-full flex-col gap-2 overflow-x-auto px-4 py-1"
        >
          <h4 className="text-accent-300 sticky left-0 text-xs uppercase">
            {key}
          </h4>
          <ul className="flex w-full gap-2">
            {values.map((value) => (
              <li key={value}>
                <button
                  data-active={
                    filtersState[key as keyof typeof filtersState] === value
                  }
                  className={classNames([
                    getCategoryColor(value),
                    "rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap uppercase duration-200",
                  ])}
                  onClick={() => {
                    setFiltersState((prev) => {
                      if (prev[key as keyof typeof filtersState] === value) {
                        const { [key]: _, ...rest } = prev
                        return rest
                      }

                      return { ...prev, [key]: value }
                    })
                  }}
                >
                  {value}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2 px-4 sm:gap-5 xl:grid-cols-4">
        <AnimatePresence initial={false}>
          {videos
            .filter((video) => {
              if (Object.keys(filtersState).length === 0) return true

              return Object.entries(filtersState).every(([key, values]) =>
                values.includes(video.data[key]),
              )
            })
            .map((video) => (
              <VideoCard key={video.id} presenceAnimations {...video.data}>
                <img src={video.data.image.src} alt="" />
              </VideoCard>
            ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
