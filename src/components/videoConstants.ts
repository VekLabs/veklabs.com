import type { CollectionEntry } from "astro:content"
import type { Variants } from "motion/react"
import type { PropsWithChildren } from "react"

export type VideoData = PropsWithChildren<
  CollectionEntry<"videos">["data"] | CollectionEntry<"features">["data"]
>

export const VIDEO_PREVIEW_START_OFFSET = 10 as const
export const SPEED_MULTIPLIER = 1
export const POPUP_DURATION = 0.75 / SPEED_MULTIPLIER
export const HOVER_DURATION = 0.75 / SPEED_MULTIPLIER

export const containerVariants: Variants = {
  initial: {
    opacity: 0,
    transition: { duration: HOVER_DURATION },
  },
  animate: {
    opacity: 1,
    transition: {
      visualDuration: HOVER_DURATION,
    },
  },
  popupShown: {
    opacity: 1,
    transition: {
      duration: POPUP_DURATION,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: HOVER_DURATION / 2,
    },
  },
  hover: {
    boxShadow: "0 10px 25px black",
  },
}

export const videoVariants: Variants = {
  hover: {
    boxShadow: "0 0 0 1.5px red",
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
  },
  loading: {
    opacity: 0,
    filter: "blur(0px)",
  },
  initial: {
    opacity: 0,
    filter: "blur(5px)",
  },
  exit: {
    opacity: 0,
    filter: "blur(5px)",
  },
}

export const titleVariants: Variants = {
  initial: {
    opacity: 1,
    bottom: "var(--bottom,24px)",
    left: "var(--left,36px)",
  },
  hover: {
    left: "var(--hover-left,24px)",
    bottom: "var(--hover-bottom,24px)",
    opacity: 0.6,
  },
}
