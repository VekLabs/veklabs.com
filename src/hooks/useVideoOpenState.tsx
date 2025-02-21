import { signal } from "@preact/signals-react"
import type { VideoData } from "../components/videoConstants"

export const globalOpenVideo = signal<VideoData | null>()
