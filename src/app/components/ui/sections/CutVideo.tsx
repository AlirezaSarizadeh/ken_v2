"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CutVideoProps {
  src: string;
  onFinish: () => void;
}

// Fallback fade duration when playback truly can't happen — keeps the cut
// feeling intentional instead of an abrupt jump to the next section.
const FALLBACK_FADE_MS = 350;

export default function CutVideo({ src, onFinish }: CutVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    const triggerFallback = () => {
      if (cancelled) return;
      // Playback blocked (iOS gesture policy, Firefox restrictions,
      // low-power mode, unsupported codec, etc.) — fade out instead of
      // instantly unmounting so the cut still reads as a transition.
      setFallback(true);
      fallbackTimer = setTimeout(() => {
        if (!cancelled) onFinish();
      }, FALLBACK_FADE_MS);
    };

    // iOS Safari sometimes needs an explicit load() before play() on a
    // freshly created <video> element, otherwise play() rejects immediately.
    video.load();

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(triggerFallback);
      }
    };

    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => {
      cancelled = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [src, onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: fallback ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: fallback ? FALLBACK_FADE_MS / 1000 : 0.25 }}
      style={{ willChange: "opacity" }}
    >
      <motion.div
        className="w-full h-full"
        initial={{ scale: 1.02 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={onFinish}
          onError={() => {
            if (!fallback) {
              setFallback(true);
              setTimeout(onFinish, FALLBACK_FADE_MS);
            }
          }}
          className="w-full h-full object-contain md:object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      </motion.div>
    </motion.div>
  );
}
