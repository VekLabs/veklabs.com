import type { CollectionEntry } from "astro:content"
import classNames from "classnames"
import { useEffect, useMemo, useState } from "react"

export interface PortfolioGridProps {
  categories: CollectionEntry<"categories">[]
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

export function PortfolioFilter({ categories }: PortfolioGridProps) {
  const [categoriesState, setCategoriesState] = useState<string>()

  useEffect(() => {
    const elementsToFilter =
      document.querySelectorAll<HTMLDivElement>("[data-category]") || []

    elementsToFilter.forEach((element) => {
      document.startViewTransition(() => {
        if (categoriesState) {
          element.classList.toggle(
            "hidden",
            !element.dataset.category?.includes(categoriesState),
          )
        } else {
          element.classList.remove("hidden")
        }
      })
    })
  }, [categoriesState])

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="no-scrollbar flex w-full flex-col gap-2 overflow-x-auto py-1">
        <h4 className="text-accent-300 sticky left-0 text-xs uppercase">
          Category
        </h4>
        <ul className="flex w-full gap-2">
          <button
            data-active={categoriesState === undefined ? "true" : "false"}
            className={classNames([
              "bg-gray-400/20 hover:bg-gray-400/50 data-[active=true]:bg-white data-[active=true]:text-black",
              "rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap uppercase duration-200",
            ])}
            onClick={() => setCategoriesState(undefined)}
          >
            All
          </button>
          {categories.map(({ slug, data: { title } }) => (
            <li key={slug}>
              <button
                data-active={categoriesState === slug ? "true" : "false"}
                className={classNames([
                  getCategoryColor(title),
                  "rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap uppercase duration-200",
                ])}
                onClick={() => {
                  if (categoriesState === slug) {
                    setCategoriesState(undefined)
                    return
                  }
                  setCategoriesState(slug)
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
