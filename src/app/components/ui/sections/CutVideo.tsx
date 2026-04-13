"use client";

import { motion } from "framer-motion";

interface CutVideoProps {
  src: string;
  onFinish: () => void;
}

export default function CutVideo({ src, onFinish }: CutVideoProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ willChange: "opacity" }}
    >
      <motion.video
        src={src}
        autoPlay
        muted
        playsInline
        onEnded={onFinish}
        onError={onFinish}
        className="w-full h-full object-cover object-center"
        initial={{ scale: 1.02 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform" }}
      />
    </motion.div>
  );
}
