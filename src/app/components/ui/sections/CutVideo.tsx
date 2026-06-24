"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface CutVideoProps {
  src: string;
  onFinish: () => void;
}

export default function CutVideo({ src, onFinish }: CutVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // iOS Safari sometimes ignores autoPlay attribute without explicit .play() call
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If autoplay blocked (e.g. low-power mode), skip the transition
        onFinish();
      });
    }
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
          src={src}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={onFinish}
          onError={onFinish}
          className="w-full h-full object-contain md:object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
