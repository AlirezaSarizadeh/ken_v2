'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

interface SideNavigationProps {
  sections: Array<{
    id: number;
    title: string;
    kanji: string;
  }>;
  currentIndex: number;
  onSectionChange: (index: number) => void;
  isMobile: boolean;
  locale: string;
}

const SECTION_ICONS = [
  {
    id: 1,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2l9 5v10c0 8-9 9-9 9s-9-1-9-9V7l9-5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12v4M10 14h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-red-600 to-red-700'
  },
  {
    id: 2,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="1" />
        <path d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8v4M10 12h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-orange-600 to-red-600'
  },
  {
    id: 3,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 8l9-6 9 6v12H3V8z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12v8h6v-8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-yellow-600 to-orange-600'
  },
  {
    id: 4,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M4 4h16v16H4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 9h16M9 4v16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-green-600 to-emerald-600'
  },
  {
    id: 5,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 6,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="9" cy="5" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="19" r="1" />
      </svg>
    ),
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 7,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2c6.627 0 12 4.477 12 10s-5.373 10-12 10c-1.518 0-2.975-.254-4.33-.715l-3.67 1.232 1.232-3.67C4.254 16.975 2 15.518 2 12 2 6.477 5.373 2 12 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-indigo-600 to-purple-600'
  },
  {
    id: 8,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-rose-600 to-pink-600'
  },
];

const BLOG_PAGE = {
  href: (locale: string) => `/${locale}/blog`,
  kanji: '記',
  label: (locale: string) => locale === 'en' ? 'Blog' : 'وبلاگ',
  color: 'from-sky-600 to-blue-700',
};

export default function SideNavigation({
  sections,
  currentIndex,
  onSectionChange,
  isMobile,
  locale,
}: SideNavigationProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Hide on mobile
  if (isMobile) return null;

  return (
    <motion.aside
      className="fixed left-0 top-1/2 -translate-y-1/2 z-30 pointer-events-auto"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-3 p-4 bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-lg rounded-r-2xl border-r border-t border-b border-red-900/20 shadow-2xl shadow-red-900/10">
        {sections.map((section, idx) => {
          const iconConfig = SECTION_ICONS[idx];
          const isActive = idx === currentIndex;
          const isHovered = hoveredIndex === idx;

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative"
            >
              <motion.button
                onClick={() => onSectionChange(idx)}
                disabled={isActive}
                className="group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 disabled:cursor-default"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Background glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${iconConfig.color} opacity-0 group-hover:opacity-20 blur transition-all duration-300`}
                  initial={{ scale: 0.8 }}
                  animate={isHovered ? { scale: 1.2 } : { scale: 0.8 }}
                />

                {/* Border effect */}
                <div
                  className={`absolute inset-0 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? `border-transparent bg-gradient-to-br ${iconConfig.color} bg-opacity-30`
                      : 'border-white/10 group-hover:border-red-600/50'
                  }`}
                />

                {/* Icon */}
                <motion.div
                  className={`relative w-6 h-6 transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-red-400'
                  }`}
                  animate={isActive ? { scale: 1.1 } : {}}
                >
                  {iconConfig.icon}
                </motion.div>

                {/* Vertical pulse indicator for active */}
                {isActive && (
                  <motion.div
                    className="absolute -right-2 w-1 h-6 bg-gradient-to-b from-red-500 to-transparent rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 40 }}
                  />
                )}
              </motion.button>

              {/* Tooltip - Show only on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-black/95 border border-red-900/50 rounded-lg text-sm font-medium text-white whitespace-nowrap z-50 pointer-events-none"
                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  >
                    {section.title}
                    {/* Arrow pointer */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-black/95 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Decorative line */}
        <motion.div
          className="w-full h-px bg-gradient-to-r from-red-900/0 via-red-900/30 to-red-900/0 my-2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3 }}
        />

        {/* Blog page link — separate from section navigation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: sections.length * 0.05 + 0.05 }}
          onMouseEnter={() => setHoveredIndex(sections.length)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="relative"
        >
          <Link href={BLOG_PAGE.href(locale)}>
            <motion.div
              className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 cursor-pointer`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${BLOG_PAGE.color} opacity-0 group-hover:opacity-20 blur transition-all duration-300`}
              />
              <div className="absolute inset-0 rounded-xl border border-sky-900/40 group-hover:border-sky-500/50 transition-all duration-300" />
              <span
                className="relative text-base font-bold text-sky-700/70 group-hover:text-sky-400 transition-colors duration-300"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {BLOG_PAGE.kanji}
              </span>
            </motion.div>
          </Link>

          <AnimatePresence>
            {hoveredIndex === sections.length && (
              <motion.div
                className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-black/95 border border-sky-900/50 rounded-lg text-sm font-medium text-white whitespace-nowrap z-50 pointer-events-none"
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                {BLOG_PAGE.label(locale)}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-black/95 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-1 text-gray-600 text-xs mt-2"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-0.5 h-3 bg-gradient-to-b from-red-600 to-transparent rounded-full" />
        </motion.div>
      </div>
    </motion.aside>
  );
}