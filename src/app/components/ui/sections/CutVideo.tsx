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

const IS_DEV = process.env.NODE_ENV === "development";

function browserTag(): string {
  if (typeof navigator === "undefined") return "ssr";
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|Chromium/.test(ua);
  if (isIOS && isSafari) return "iOS Safari";
  if (isIOS) return "iOS WebView (Chrome/Firefox-on-iOS)";
  if (/Firefox/.test(ua)) return "Firefox";
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome|CriOS/.test(ua)) return "Chrome";
  if (/Safari/.test(ua)) return "Safari (desktop)";
  return "Unknown";
}

export default function CutVideo({ src, onFinish }: CutVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let firedFallback = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    const tag = browserTag();

    const log = (...args: unknown[]) => {
      if (IS_DEV) console.log(`[CutVideo/${tag}]`, src, "—", ...args);
    };

    const triggerFallback = (reason: string) => {
      if (cancelled || firedFallback) return;
      firedFallback = true;
      log("falling back (no real playback):", reason);
      // Playback blocked (iOS gesture policy, Firefox restrictions,
      // low-power mode, unsupported codec, etc.) — fade out instead of
      // instantly unmounting so the cut still reads as a transition.
      setFallback(true);
      fallbackTimer = setTimeout(() => {
        if (!cancelled) onFinish();
      }, FALLBACK_FADE_MS);
    };

    // Diagnostic: the transition assets are encoded as HEVC (hev1, in-band
    // parameter sets). WebKit/iOS Safari is known to be unreliable decoding
    // hev1-tagged HEVC in <video> even on hardware that supports HEVC
    // generally. Checking canPlayType tells us upfront, per browser, whether
    // to even bother attempting playback.
    const support = {
      hev1: video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"'),
      hvc1: video.canPlayType('video/mp4; codecs="hvc1.1.6.L93.B0"'),
      genericMp4: video.canPlayType("video/mp4"),
    };
    log("canPlayType:", support);

    if (
      support.hev1 === "" &&
      support.hvc1 === "" &&
      support.genericMp4 === ""
    ) {
      triggerFallback("canPlayType reports no support for this codec");
      return () => {
        cancelled = true;
        if (fallbackTimer) clearTimeout(fallbackTimer);
      };
    }

    // iOS Safari sometimes needs an explicit load() before play() on a
    // freshly created <video> element, otherwise play() rejects immediately.
    video.load();

    const tryPlay = () => {
      log("attempting play() — readyState:", video.readyState);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => log("play() succeeded"))
          .catch((err: unknown) => {
            const name = err instanceof Error ? err.name : String(err);
            triggerFallback(`play() rejected — ${name}`);
          });
      }
    };

    const handleError = () => {
      const mediaErr = video.error;
      triggerFallback(
        `error event — code ${mediaErr?.code ?? "?"} ${mediaErr?.message ?? ""}`,
      );
    };

    video.addEventListener("error", handleError);

    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => {
      cancelled = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("error", handleError);
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
          className="w-full h-full object-contain md:object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      </motion.div>
    </motion.div>
  );
}
