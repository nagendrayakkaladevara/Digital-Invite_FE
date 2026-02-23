"use client";

import { useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useViewportVideo } from "@/hooks/useViewportVideo";
import { cn } from "@/lib/utils";

import weddingVideo from "@/assets/video/video.mp4";

const ASPECT_WIDTH = 9;
const ASPECT_HEIGHT = 16;

/**
 * Wedding video section with YouTube Shorts (9:16) aspect ratio.
 * Plays unmuted by default; falls back to muted if browser blocks autoplay.
 * Viewport-triggered play/pause via IntersectionObserver.
 */
export default function WeddingVideoSection() {
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useViewportVideo<HTMLVideoElement>({
    threshold: 0.2,
    rootMargin: "0px 0px -15% 0px",
    debounceMs: 120,
    onAutoplayMuted: () => setIsMuted(true),
  });

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  }, [videoRef]);

  return (
    <section
      id="video"
      className={cn(
        "relative flex min-h-[min(100dvh,56.25vw)] w-full items-center justify-center",
        "bg-[linear-gradient(180deg,oklch(0.99_0_0)_0%,oklch(0.97_0.01_264)_100%)]",
        "py-12 sm:py-16 md:py-20 lg:py-24",
        "px-4 sm:px-6"
      )}
      aria-label="Wedding video"
    >
      <div
        className={cn(
          "relative w-full max-w-[min(92vw,420px)]",
          "rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-3xl",
          "shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)]",
          "overflow-hidden",
          "ring-1 ring-black/4"
        )}
        style={{
          aspectRatio: `${ASPECT_WIDTH} / ${ASPECT_HEIGHT}`,
        }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={weddingVideo}
          loop
          playsInline
          preload="auto"
          aria-label="Wedding video"
        />
        <button
          type="button"
          onClick={toggleMute}
          className={cn(
            "absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center",
            "rounded-full bg-black/40 backdrop-blur-sm transition-colors",
            "hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20",
            "active:scale-95"
          )}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white" aria-hidden />
          ) : (
            <Volume2 className="h-5 w-5 text-white" aria-hidden />
          )}
        </button>
      </div>
    </section>
  );
}
