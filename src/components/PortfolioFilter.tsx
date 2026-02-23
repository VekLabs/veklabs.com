import type { Type } from '@/payload-types'
import classNames from 'classnames'

export interface PortfolioGridProps {
  categories: Type[]
  activeCategory?: Type['slug']
  onChange: (categorySlug?: Type['slug']) => void
}

const categoryColors = [
  'ring-red-300 bg-red-400/20 hover:bg-red-400/50 data-[active=true]:bg-red-400/50 data-[active=true]:ring-2',
  'ring-blue-300 bg-blue-400/20 hover:bg-blue-400/50 data-[active=true]:bg-blue-400/50 data-[active=true]:ring-2',
  'ring-green-300 bg-green-400/20 hover:bg-green-400/50 data-[active=true]:bg-green-400/50 data-[active=true]:ring-2',
  'ring-yellow-300 bg-yellow-400/20 hover:bg-yellow-400/50 data-[active=true]:bg-yellow-400/50 data-[active=true]:ring-2',
  'ring-purple-300 bg-purple-400/20 hover:bg-purple-400/50 data-[active=true]:bg-purple-400/50 data-[active=true]:ring-2',
  'ring-pink-300 bg-pink-400/20 hover:bg-pink-400/50 data-[active=true]:bg-pink-400/50 data-[active=true]:ring-2',
]

const getCategoryColor = (category: string) => {
  const hash = category
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  return categoryColors[hash % categoryColors.length]
}

export function PortfolioFilter({
  categories,
  activeCategory,
  onChange,
}: PortfolioGridProps) {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="no-scrollbar flex w-full flex-col gap-2 overflow-x-auto py-1">
        <h4 className="text-accent-300 sticky left-0 text-xs uppercase">
          Category
        </h4>
        <ul className="flex w-full gap-2">
          <button
            className={classNames([
              activeCategory === undefined
                ? 'bg-white text-black'
                : 'bg-gray-400/20 hover:bg-gray-400/50',
              'bg-gray-400/20 hover:bg-gray-400/50',
              'rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap uppercase duration-200',
            ])}
            onClick={() => onChange(undefined)}
          >
            All
          </button>
          {categories?.map(({ slug, title }) => (
            <li key={slug}>
              <button
                data-active={activeCategory === slug}
                className={classNames(
                  [
                    getCategoryColor(title),
                    'rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap uppercase duration-200',
                  ],
                  {},
                )}
                onClick={() => {
                  if (activeCategory === slug) {
                    onChange(undefined)
                    return
                  }
                  onChange(slug)
                }}
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
