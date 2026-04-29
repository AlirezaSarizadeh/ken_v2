"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlobalMessages } from "../../../types/messages";

// Components
import Section1 from "../sections/Section1";
import Section2 from "../sections/Section2";
import Section3 from "../sections/Section3";
import Section4 from "../sections/Section4";
import Section5 from "../sections/Section5";
import Section6 from "../sections/Store";
import Section7 from "../sections/Members";
import Section8 from "../sections/Katuri";
import CutVideo from "../ui/sections/CutVideo";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import SideNavigation from "../ui/navigation/SideNavigation";

const TRANSITION_VIDEOS: Record<string, string> = {
  // Section 1 - Academy
  "1-2": "/transitions/1_to_2.m4v",
  "1-3": "/transitions/1_to_3.m4v",
  "1-4": "/transitions/1_to_4.m4v",
  "1-5": "/transitions/1_to_5.m4v",
  "1-6": "/transitions/1_to_6.m4v",
  "1-7": "/transitions/1_to_7.m4v",
  "1-8": "/transitions/1_to_8.m4v",

  // Section 2 - About
  "2-1": "/transitions/2_to_1.m4v",
  "2-3": "/transitions/2_to_3.m4v",
  "2-4": "/transitions/2_to_4.m4v",
  "2-5": "/transitions/2_to_5.m4v",
  "2-6": "/transitions/2_to_6.m4v",
  "2-7": "/transitions/2_to_7.m4v",
  "2-8": "/transitions/2_to_8.m4v",

  // Section 3 - Contact
  "3-1": "/transitions/3_to_1.m4v",
  "3-2": "/transitions/3_to_2.m4v",
  "3-4": "/transitions/3_to_4.m4v",
  "3-5": "/transitions/3_to_5.m4v",
  "3-6": "/transitions/3_to_6.m4v",
  "3-7": "/transitions/3_to_7.m4v",
  "3-8": "/transitions/3_to_8.m4v",

  // Section 4 - Courses
  "4-1": "/transitions/4_to_1.m4v",
  "4-2": "/transitions/4_to_2.m4v",
  "4-3": "/transitions/4_to_3.m4v",
  "4-5": "/transitions/4_to_5.m4v",
  "4-6": "/transitions/4_to_6.m4v",
  "4-7": "/transitions/4_to_7.m4v",
  "4-8": "/transitions/4_to_8.m4v",

  // Section 5 - gallery
  "5-1": "/transitions/5_to_1.m4v",
  "5-2": "/transitions/5_to_2.m4v",
  "5-3": "/transitions/5_to_3.m4v",
  "5-4": "/transitions/5_to_4.m4v",
  "5-5": "/transitions/5_to_5.m4v",
  "5-6": "/transitions/5_to_6.m4v",
  "5-7": "/transitions/5_to_7.m4v",
  "5-8": "/transitions/5_to_8.m4v",

  // Section 6 - store
  "6-1": "/transitions/6_to_1.m4v",
  "6-2": "/transitions/6_to_2.m4v",
  "6-3": "/transitions/6_to_3.m4v",
  "6-4": "/transitions/6_to_4.m4v",
  "6-5": "/transitions/6_to_5.m4v",
  "6-6": "/transitions/6_to_6.m4v",
  "6-7": "/transitions/6_to_7.m4v",
  "6-8": "/transitions/6_to_8.m4v",

  // Section 7 - members
  "7-1": "/transitions/7_to_1.m4v",
  "7-2": "/transitions/7_to_2.m4v",
  "7-3": "/transitions/7_to_3.m4v",
  "7-4": "/transitions/7_to_4.m4v",
  "7-5": "/transitions/7_to_5.m4v",
  "7-6": "/transitions/7_to_6.m4v",
  "7-7": "/transitions/7_to_7.m4v",
  "7-8": "/transitions/7_to_8.m4v",

  // Section 8 - katuri
  "8-1": "/transitions/8_to_1.m4v",
  "8-2": "/transitions/8_to_2.m4v",
  "8-3": "/transitions/8_to_3.m4v",
  "8-4": "/transitions/8_to_4.m4v",
  "8-5": "/transitions/8_to_5.m4v",
  "8-6": "/transitions/8_to_6.m4v",
  "8-7": "/transitions/8_to_7.m4v",
  "8-8": "/transitions/8_to_8.m4v",
};

export default function DojoPageClient({
  messages,
}: {
  messages: GlobalMessages;
}) {
  // --- Data Configuration (FROM JSON) ---
  const SECTIONS = useMemo(() => {
    const s = messages?.Home?.sections;

    return [
      {
        id: 1,
        component: Section1,
        video: "/transitions/video3.m4v",
        title: s?.academy?.title ?? "آکادمی کنجوتسو",
        kanji: s?.academy?.kanji ?? "師範",
        desc: s?.academy?.desc ?? "",
      },
      {
        id: 2,
        component: Section2,
        video: "/transitions/video2.m4v",
        title: s?.about?.title ?? "درباره ما",
        kanji: s?.about?.kanji ?? "私たち",
        desc: s?.about?.desc ?? "",
      },
      {
        id: 3,
        component: Section3,
        video: "/transitions/video3.m4v",
        title: s?.contact?.title ?? "تماس با ما",
        kanji: s?.contact?.kanji ?? "連絡",
        desc: s?.contact?.desc ?? "",
      },
      {
        id: 4,
        component: Section4,
        video: "/transitions/video3.m4v",
        title: s?.courses?.title ?? "دوره‌ها",
        kanji: s?.courses?.kanji ?? "級",
        desc: s?.courses?.desc ?? "",
      },
      {
        id: 5,
        component: Section5,
        video: "/transitions/video2.m4v",
        title: s?.gallery?.title ?? "گالری",
        kanji: s?.gallery?.kanji ?? "美術館",
        desc: s?.gallery?.desc ?? "",
      },
      {
        id: 6,
        component: Section6,
        video: "/transitions/video2.m4v",
        title: s?.store?.title ?? "فروشگاه",
        kanji: s?.store?.kanji ?? "美術館",
        desc: s?.store?.desc ?? "",
      },
      {
        id: 7,
        component: Section7,
        video: "/transitions/video2.m4v",
        title: s?.members?.title ?? "اعضا",
        kanji: s?.members?.kanji ?? "美術館",
        desc: s?.members?.desc ?? "",
      },
      {
        id: 8,
        component: Section8,
        video: "/transitions/video2.m4v",
        title: s?.katuri?.title ?? "کاتوری",
        kanji: s?.katuri?.kanji ?? "美術館",
        desc: s?.katuri?.desc ?? "",
      },
    ];
  }, [messages]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cutting, setCutting] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [transitionId, setTransitionId] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startTransition = useCallback(
    (nextIndex: number) => {
      if (nextIndex === currentIndex || cutting || exiting) return;

      const fromSection = SECTIONS[currentIndex];
      const toSection = SECTIONS[nextIndex];

      const key = `${fromSection.id}-${toSection.id}`;
      const customTransitionVideo = TRANSITION_VIDEOS[key];

      const selectedVideoSrc = customTransitionVideo ?? toSection.video;

      setExiting(true);
      setVideoSrc(selectedVideoSrc);
      setTransitionId((prev) => prev + 1);

      setTimeout(() => {
        setCutting(true);
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setExiting(false);
          setMobileMenuOpen(false); // Close menu after selection
        }, 300);
      }, 500);
    },
    [currentIndex, cutting, exiting, SECTIONS],
  );

  const handleNext = useCallback(() => {
    if (currentIndex < SECTIONS.length - 1) startTransition(currentIndex + 1);
  }, [currentIndex, startTransition, SECTIONS.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) startTransition(currentIndex - 1);
  }, [currentIndex, startTransition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cutting || exiting) return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowLeft":
          handleNext();
          break;
        case "ArrowUp":
        case "ArrowRight":
          handlePrev();
          break;
        default:
          if (e.key >= "1" && e.key <= "8")
            startTransition(parseInt(e.key) - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, cutting, exiting, startTransition]);

  const activeSection = SECTIONS[currentIndex];
  const ActiveComponent = activeSection.component;

  return (
    <main className="w-screen h-[100dvh] relative overflow-hidden bg-black text-white flex flex-col font-sans">
      {/* Video Overlay (Cinematic Cut) */}
      <AnimatePresence mode="wait">
        {cutting && (
          <div className="absolute inset-0 z-50 pointer-events-none bg-black">
            <CutVideo
              key={transitionId}
              src={videoSrc}
              onFinish={() => setCutting(false)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Content Layer */}
      <div className="relative z-0 flex-1 w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="min-h-full w-full flex flex-col items-center justify-center pb-20 md:py-0 px-4 md:px-0">
          <ActiveComponent exiting={exiting} messages={messages} />
        </div>
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between">
        {/* Top row: switcher (left) + header info (right) + mobile menu */}
        <div className="w-full p-4 md:p-6 flex items-start justify-between">
          {/* Language Switcher - Hidden on mobile if menu is open */}
          <motion.div
            className={`pointer-events-auto ${mobileMenuOpen ? "hidden" : "block"}`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <LanguageSwitcher compact={isMobile} />
          </motion.div>

          {/* Header Info - Hidden on mobile */}
          <motion.header
            className="hidden md:flex justify-end items-start"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-black/60 backdrop-blur-md border border-red-900/30 p-4 rounded-xl flex items-center gap-4 shadow-lg shadow-red-900/10">
              <span
                className="text-4xl text-red-600 font-black tracking-tighter"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {activeSection.kanji}
              </span>
              <div className="flex flex-col border-l border-red-800/50 pl-4">
                <h1
                  className="text-red-500 font-bold uppercase tracking-widest text-sm md:text-lg"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {activeSection.title}
                </h1>
              </div>
            </div>
          </motion.header>

          {/* Mobile Hamburger Menu - Enhanced */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden pointer-events-auto ml-auto relative w-12 h-12 flex flex-col items-center justify-center gap-1.5 group bg-gradient-to-br from-red-600/20 to-red-700/10 border border-red-600/40 rounded-xl hover:from-red-600/30 hover:to-red-700/20 transition-all duration-300"
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-red-600/0 group-hover:bg-red-600/10 blur transition-all duration-300"
            />

            {/* Hamburger lines */}
            <motion.span
              className="w-6 h-0.5 bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-300 relative z-10"
              animate={
                mobileMenuOpen
                  ? { rotate: 45, y: 8, width: 24 }
                  : { rotate: 0, y: 0, width: 24 }
              }
            />
            <motion.span
              className="w-6 h-0.5 bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-300 relative z-10"
              animate={mobileMenuOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-300 relative z-10"
              animate={
                mobileMenuOpen
                  ? { rotate: -45, y: -8, width: 24 }
                  : { rotate: 0, y: 0, width: 24 }
              }
            />

            {/* Pulse effect when menu is open */}
            {mobileMenuOpen && (
              <motion.div
                className="absolute inset-0 rounded-xl border border-red-500/50"
                animate={{ boxShadow: ['0 0 0 2px rgba(239, 68, 68, 0.5)', '0 0 0 8px rgba(239, 68, 68, 0)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobile && mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                className="absolute inset-x-0 top-0 bg-black/95 border-b border-red-900/50 backdrop-blur-xl pointer-events-auto z-40 max-h-[80vh] overflow-y-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6 space-y-2">
                  {/* Menu Title */}
                  <h2
                    className="text-sm font-bold text-gray-400 mb-4"
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  >
                    سکشن‌ها
                  </h2>

                  {/* Menu Items */}
                  {SECTIONS.map((section, idx) => {
                    const isActive = idx === currentIndex;

                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => startTransition(idx)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`
                          w-full flex items-center gap-4 p-4 rounded-lg
                          transition-all duration-200
                          ${
                            isActive
                              ? 'bg-red-900/40 border border-red-600/60'
                              : 'border border-white/10 hover:bg-white/5 active:scale-95'
                          }
                        `}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive
                            ? 'bg-red-600/30'
                            : 'bg-white/10'
                        }`}>
                          <span
                            className={`text-lg font-bold ${
                              isActive ? 'text-red-500' : 'text-gray-400'
                            }`}
                            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                          >
                            {section.kanji}
                          </span>
                        </div>

                        {/* Text */}
                        <div className="text-left flex-1">
                          <p
                            className={`text-sm font-bold ${
                              isActive ? 'text-white' : 'text-gray-300'
                            }`}
                            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                          >
                            {section.title}
                          </p>
                        </div>

                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="w-2 h-2 rounded-full bg-red-500"
                            layoutId="activeMenuIndicator"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Navigation (Desktop Only) */}
        {!isMobile && (
          <motion.footer
            className="w-full p-6 pb-8 flex justify-center items-end pointer-events-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="
                relative flex items-center justify-between
                bg-black/80 backdrop-blur-xl border border-red-900/50 
                shadow-[0_0_30px_rgba(220,38,38,0.2)]
                transition-all duration-500 ease-out
                w-auto gap-8 rounded-full px-8 py-3
              "
            >
              <NavButton
                direction="prev"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                isMobile={false}
              />

              <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                {SECTIONS.map((section, idx) => {
                  const isActive = idx === currentIndex;

                  return (
                    <motion.div
                      key={section.id}
                      layout
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => startTransition(idx)}
                    >
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? "bg-red-900/40 border border-red-600/60"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <span
                          className={`text-sm font-medium whitespace-nowrap ${
                            isActive ? "text-white" : "text-gray-400"
                          }`}
                          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                        >
                          {section.title}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <NavButton
                direction="next"
                onClick={handleNext}
                disabled={currentIndex === SECTIONS.length - 1}
                isMobile={false}
              />
            </div>
          </motion.footer>
        )}
      </div>

      {/* Side Navigation (Desktop Only) */}
      <SideNavigation
        sections={SECTIONS.map(s => ({ id: s.id, title: s.title, kanji: s.kanji }))}
        currentIndex={currentIndex}
        onSectionChange={startTransition}
        isMobile={isMobile}
      />
    </main>
  );
}

function NavButton({
  direction,
  onClick,
  disabled,
  isMobile,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  isMobile: boolean;
}) {
  const isNext = direction === "next";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 shrink-0 ${
        disabled
          ? "opacity-30 cursor-not-allowed border-gray-800 text-gray-700"
          : "cursor-pointer border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className={`w-5 h-5 transition-transform ${!isMobile && "-rotate-90"}`}
      >
        {isNext ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        )}
      </svg>
    </button>
  );
}