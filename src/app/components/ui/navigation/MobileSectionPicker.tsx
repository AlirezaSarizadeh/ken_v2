'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface MobileSectionPickerProps {
  sections: Array<{
    id: number;
    title: string;
    kanji: string;
  }>;
  currentIndex: number;
  onSectionChange: (index: number) => void;
}

export default function MobileSectionPicker({
  sections,
  currentIndex,
  onSectionChange,
}: MobileSectionPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsExpanded(false)}
        />
      )}

      <motion.div
        className="fixed bottom-4 left-4 right-4 z-40 md:hidden"
        layout
      >
        <motion.div
          className={`
            bg-black/90 border border-red-900/50 backdrop-blur-xl
            rounded-2xl shadow-2xl shadow-red-900/20
            transition-all duration-300
            ${isExpanded ? 'p-4' : 'p-3'}
          `}
        >
          {!isExpanded ? (
            // Compact view - show current section
            <motion.button
              onClick={() => setIsExpanded(true)}
              className="w-full flex items-center justify-between gap-3 text-left"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-start">
                  <span
                    className="text-lg font-bold text-red-500"
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {sections[currentIndex].kanji}
                  </span>
                  <span
                    className="text-xs text-gray-400"
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  >
                    {sections[currentIndex].title}
                  </span>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-red-500 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.button>
          ) : (
            // Expanded view - show all sections
            <motion.div className="space-y-2">
              <motion.div
                className="flex items-center justify-between mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  سکشن‌ها
                </h3>
                <motion.button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              </motion.div>

              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {sections.map((section, idx) => {
                  const isActive = idx === currentIndex;

                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => {
                        onSectionChange(idx);
                        setIsExpanded(false);
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        p-3 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? 'bg-red-900/50 border border-red-600/60 shadow-lg shadow-red-900/20'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      <motion.div
                        className="flex flex-col items-start"
                        layoutId={`section-${section.id}`}
                      >
                        <span
                          className={`text-sm font-bold ${
                            isActive ? 'text-red-500' : 'text-gray-300'
                          }`}
                          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                        >
                          {section.kanji}
                        </span>
                        <span
                          className={`text-xs ${
                            isActive ? 'text-red-200' : 'text-gray-500'
                          }`}
                          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                        >
                          {section.title}
                        </span>
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}