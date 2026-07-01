"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface CutVideoProps {
  src: string;
  onFinish: () => void;
}

export default function CutVideo({ src, onFinish }: CutVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    // iOS Safari sometimes needs an explicit load() before play() on a
    // freshly created <video> element, otherwise play() rejects immediately.
    video.load();

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (cancelled) return;
          // Autoplay blocked (iOS gesture policy, Firefox restrictions,
          // low-power mode, etc.) — skip the transition instead of
          // freezing on a black screen.
          onFinish();
        });
      }
    };

    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => {
      cancelled = true;
      video.removeEventListener("canplay", tryPlay);
    };
  }, [src, onFinish]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
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
          onError={onFinish}
          className="w-full h-full object-contain md:object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      </motion.div>
    </motion.div>
  );
}