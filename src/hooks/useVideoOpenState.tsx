import { signal } from "@preact/signals"

export const globalOpenVideo = signal<string | number>(0)

export function useVideoOpenState(
  videoId: string | number,
): [
  open: boolean,
  setOpen: (isOpen: boolean) => void,
  otherVideoOpen: boolean,
] {
  const globalVideoId = globalOpenVideo.value
  const setGlobalVideoId = (newId: string | number) => {
    globalOpenVideo.value = newId
  }

  let isOpen = globalVideoId === videoId
  const setIsOpen = (isOpen: boolean) => {
    setGlobalVideoId(isOpen ? videoId : "")
    isOpen = isOpen
  }

  let otherVideoOpen = Boolean(globalVideoId) && globalVideoId !== videoId

  return [isOpen, setIsOpen, otherVideoOpen]
}
