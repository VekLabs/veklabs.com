import type { Type, Video } from '@/payload-types'
import type { Populated } from '@/utils/typeChecks'
import { useState } from 'react'
import { PortfolioFilter } from './PortfolioFilter'
import VideoCard from './VideoCard'

export function FilteredVideoGrid({
  categories,
  videos,
}: {
  categories: Type[]
  videos: Populated<Video>[]
}) {
  const [activeCategory, setActiveCategory] = useState<string>()

  const filteredVideos = videos.filter((video) => {
    if (!activeCategory) return true

    return video.type.slug === activeCategory
  })

  return (
    <div className="flex w-full flex-col gap-8">
      <PortfolioFilter
        onChange={setActiveCategory}
        categories={categories}
        activeCategory={activeCategory}
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 xl:grid-cols-4">
        {filteredVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  )
}
