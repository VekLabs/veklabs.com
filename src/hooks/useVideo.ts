import { useEffect, useState, type ChangeEvent, type RefObject } from "react"

export function useVideo(ref: RefObject<HTMLVideoElement>) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    if (!ref.current) return

    function handlePlay() {
      setIsPlaying(true)
    }

    function handlePause() {
      setIsPlaying(false)
    }

    ref.current.addEventListener("play", handlePlay)
    ref.current.addEventListener("pause", handlePause)

    return () => {
      ref.current?.removeEventListener("play", handlePlay)
      ref.current?.removeEventListener("pause", handlePause)
    }
  }, [ref])

  useEffect(() => {
    if (!ref.current) return

    function handleVolumeChange(event: any) {
      setIsMuted(event?.currentTarget.muted)
    }

    ref.current.addEventListener("volumechange", handleVolumeChange)

    return () => {
      ref.current?.removeEventListener("volumechange", handleVolumeChange)
    }
  }, [ref])

  function play() {
    if (!ref.current) return
    ref.current?.play()
  }

  function pause() {
    if (!ref.current) return
    ref.current?.pause()
  }

  function mute() {
    if (!ref.current) return
    ref.current.muted = true
  }

  function unmute() {
    if (!ref.current) return
    ref.current.muted = false
  }

  return { play, pause, mute, unmute, isPlaying, isMuted }
}
