"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface MobileBottomNavProps {
  sections: Array<{
    id: number;
    title: string;
    kanji: string;
  }>;
  currentIndex: number;
  onSectionChange: (index: number) => void;
  locale: string;
  hidden?: boolean;
}

export default function MobileBottomNav({
  sections,
  currentIndex,
  onSectionChange,
  locale,
  hidden = false,
}: MobileBottomNavProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Keep the active item visible — app-like behavior when there are many tabs
  useEffect(() => {
    const item = itemRefs.current[currentIndex];
    if (item) {
      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  return (
    <motion.nav
      className={`md:hidden fixed bottom-0 inset-x-0 z-30 pointer-events-auto ${
        hidden ? "hidden" : ""
      }`}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 18 }}
      aria-label={locale === "fa" ? "ناوبری بخش‌ها" : "Section navigation"}
    >
      <div
        className="bg-black/90 backdrop-blur-xl border-t border-red-900/40 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          ref={scrollerRef}
          className="flex items-stretch overflow-x-auto no-scrollbar px-1"
        >
          {sections.map((section, idx) => {
            const isActive = idx === currentIndex;

            return (
              <button
                key={section.id}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => onSectionChange(idx)}
                disabled={isActive}
                className="relative flex-shrink-0 flex flex-col items-center justify-center gap-0.5 min-w-[68px] px-2 pt-2.5 pb-2 disabled:cursor-default"
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active top indicator */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavActive"
                    className="absolute top-0 inset-x-3 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}

                {/* Kanji as icon */}
                <span
                  className={`text-lg leading-none transition-colors duration-200 ${
                    isActive ? "text-red-400" : "text-gray-500"
                  }`}
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {section.kanji}
                </span>

                {/* Label */}
                <span
                  className={`text-[10px] leading-tight whitespace-nowrap transition-colors duration-200 ${
                    isActive ? "text-white font-bold" : "text-gray-500"
                  }`}
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {section.title}
                </span>
              </button>
            );
          })}

          {/* Divider */}
          <div className="flex-shrink-0 self-center w-px h-8 bg-red-900/30 mx-1" />

          {/* Blog — separate internal page link */}
          <Link
            href={`/${locale}/blog`}
            className="relative flex-shrink-0 flex flex-col items-center justify-center gap-0.5 min-w-[68px] px-2 pt-2.5 pb-2"
          >
            <span
              className="text-lg leading-none text-sky-600/80"
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              記
            </span>
            <span
              className="text-[10px] leading-tight whitespace-nowrap text-sky-300/70"
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              {locale === "fa" ? "وبلاگ" : "Blog"}
            </span>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
