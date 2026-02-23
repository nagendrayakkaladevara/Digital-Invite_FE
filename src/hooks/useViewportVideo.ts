import { useRef, useEffect, useCallback } from "react";
import type { RefObject } from "react";

const DEFAULT_THRESHOLD = 0.25;
const DEFAULT_ROOT_MARGIN = "0px 0px -10% 0px";

export interface UseViewportVideoOptions {
  /** Intersection ratio (0-1) at which video should play. Default: 0.25 */
  threshold?: number;
  /** Root margin for intersection calculation. Shrinks the effective viewport. Default: "-10%" bottom */
  rootMargin?: string;
  /** Debounce pause to avoid rapid play/pause on scroll boundary. Default: 150ms */
  debounceMs?: number;
  /** Called when the browser forces mute due to autoplay policy */
  onAutoplayMuted?: () => void;
}

/**
 * Hook to control video play/pause based on viewport visibility.
 * Tries unmuted playback first; falls back to muted if browser blocks it.
 */
export function useViewportVideo<T extends HTMLVideoElement>(
  options: UseViewportVideoOptions = {}
): RefObject<T | null> {
  const {
    threshold = DEFAULT_THRESHOLD,
    rootMargin = DEFAULT_ROOT_MARGIN,
    debounceMs = 150,
    onAutoplayMuted,
  } = options;

  const videoRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastVisibleRef = useRef<boolean | null>(null);
  const onAutoplayMutedRef = useRef(onAutoplayMuted);
  onAutoplayMutedRef.current = onAutoplayMuted;

  const updatePlayState = useCallback(
    (isVisible: boolean) => {
      if (lastVisibleRef.current === isVisible) return;
      lastVisibleRef.current = isVisible;

      const video = videoRef.current;
      if (!video) return;

      if (isVisible) {
        // Try playing as-is (unmuted if that's the current state)
        video.play().catch(() => {
          // Browser blocked unmuted autoplay — mute and retry
          video.muted = true;
          onAutoplayMutedRef.current?.();
          video.play().catch(() => {});
        });
      } else {
        video.pause();
      }
    },
    []
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      const entry = entries[0];
      if (!entry) return;

      const isVisible = entry.isIntersecting;

      if (debounceMs > 0) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          debounceTimerRef.current = null;
          updatePlayState(isVisible);
        }, debounceMs);
      } else {
        updatePlayState(isVisible);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(video);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [threshold, rootMargin, debounceMs, updatePlayState]);

  return videoRef;
}
