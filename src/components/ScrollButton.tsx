import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/dist/ssr'
import { useEffect, useState } from 'react'
import { scrollSnapToNext } from 'scroll-snap-api'
import { cn } from '../utils/cn'

export interface ScrollButtonsProps {
  /** The id of the element to scroll */
  scrollElementId: string
  direction: 'right' | 'left'
  className?: string
}

export function ScrollButton({
  scrollElementId: scrollElement,
  direction,
  className,
}: ScrollButtonsProps) {
  const [scrollElementRef, setScrollElementRef] =
    useState<HTMLDivElement | null>(
      typeof window !== 'undefined'
        ? (document.getElementById(scrollElement) as HTMLDivElement)
        : null,
    )

  useEffect(() => {
    if (!scrollElementRef) {
      setScrollElementRef(
        document.getElementById(scrollElement) as HTMLDivElement,
      )
    }
  }, [scrollElement, scrollElementRef])

  return (
    <button
      style={{
        animationName: direction === 'left' ? 'fade-in' : 'fade-out',
        animationTimingFunction: 'linear',
        animationFillMode: 'both',
        animationDirection: 'alternate',
        animationRangeStart:
          direction === 'right' ? 'calc(100% - 150px)' : '0px',
        animationRangeEnd:
          direction === 'right' ? 'calc(100% - 75px)' : 'exit 75px',
        animationTimeline: `--${scrollElement}`,
      }}
      className={cn(
        'rounded-full bg-white/80 p-4 text-black backdrop-blur-lg hover:bg-white',
        className,
      )}
      onClick={() => {
        if (!scrollElementRef) return
        scrollSnapToNext(scrollElementRef, direction, { behavior: 'smooth' })
      }}
      title={
        direction === 'right' ? 'Scroll section right' : 'Scroll section left'
      }
    >
      {direction === 'right' ? <CaretRightIcon /> : <CaretLeftIcon />}
    </button>
  )
}
