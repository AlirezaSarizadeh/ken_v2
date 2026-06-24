"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import type { GlobalMessages } from "@/types/messages";
import type { DojoApiData } from "@/types/api";

const FALLBACK_TABS = [
  { id: 0, title: "تاریخچه", kanji: "歴史", content: "دوجو ما بیش از ۵۰ سال است که در زمینه هنرهای رزمی ژاپنی فعالیت دارد. این مکان توسط اولین استاد ما تأسیس شد که پس از سال‌ها تمرین در ژاپن، به ایران بازگشت تا دانش خود را با علاقه‌مندان به اشتراک بگذارد.", image: "/history.jpg" },
  { id: 1, title: "فلسفه ما", kanji: "哲学", content: "ما بر اصول بوشیدو - راه جنگجو - تأکید داریم: صداقت، شجاعت، احترام، و وفاداری. این اصول نه تنها در تمرینات ما، بلکه در زندگی روزمره دانش‌آموزان ما نیز نفوذ می‌کند.", image: "/philosophy.jpg" },
  { id: 2, title: "استادان ما", kanji: "師範", content: "تیم ما متشکل از استادان مجرب با سال‌ها تجربه در هنرهای رزمی مختلف است. هر استاد در یک زمینه خاص تخصص دارد و با اشتیاق به دانش‌آموزان خود آموزش می‌دهد.", image: "/masters.jpg" },
  { id: 3, title: "دستاوردها", kanji: "成果", content: "دانش‌آموزان ما موفق به کسب جوایز متعدد در مسابقات ملی و بین‌المللی شده‌اند. اما بزرگترین دستاورد ما، رشد و توسعه شخصیتی صدها دانش‌آموز است.", image: "/achievements.jpg" },
];

export default function Section2({ exiting, messages, apiData }: { exiting: boolean; messages?: GlobalMessages; apiData?: DojoApiData }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const t = messages?.Section2 as any;
  const about = apiData?.aboutData;

  const TABS_DATA = useMemo(() => {
    const fromApi = about?.tabs?.filter(Boolean).map((tab: any, idx: number) => ({
      id: tab.id ?? idx,
      title: tab.title ?? "",
      kanji: tab.kanji ?? "",
      content: tab.content ?? "",
      image: tab.image ?? "",
    }));
    if (fromApi?.length) return fromApi;
    const fromJson = t?.tabs?.filter(Boolean);
    return fromJson?.length ? fromJson : FALLBACK_TABS;
  }, [about?.tabs, t?.tabs]);

  const headingTitle = about?.heading?.title ?? t?.heading?.title ?? "درباره ما";
  const headingKanji = about?.heading?.kanji ?? t?.heading?.kanji ?? "私たち";
  const foundedLabel = about?.founded?.label ?? t?.founded?.label ?? "تأسیس:";
  const foundedValue = about?.founded?.value ?? t?.founded?.value ?? "۱۳۵۰ خورشیدی";
  const moreInfo = t?.moreInfo ?? "اطلاعات بیشتر";

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-12 md:py-0 overflow-hidden" id="about">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10"></div>

        <motion.div
          className="absolute inset-0 bg-cover bg-center fixed"
          style={{ backgroundImage: "url('/about_bg.webp')", zIndex: 0 }}
          animate={{ scale: exiting ? 1.2 : 1, opacity: exiting ? 0.8 : 1 }}
          initial={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        <div className="absolute top-5 left-5 text-red-950/20 text-8xl font-black select-none z-0"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>道</div>
        <div className="absolute bottom-5 right-5 text-red-950/20 text-8xl font-black select-none z-0"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>場</div>
      </div>

      {/* Content Wrapper */}
      <motion.div
        id="main-content-section2"
        layout
        className="w-full flex justify-center overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isSectionOpen && !exiting ? "auto" : 0,
          opacity: isSectionOpen && !exiting ? 1 : 0,
        }}
        transition={{
          height: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.5, delay: isSectionOpen ? 0.2 : 0 },
        }}
      >
        <motion.div
          layout
          className="
            relative z-10
            w-full max-w-6xl
            flex flex-col md:flex-row
            bg-[#0a0a0a]
            border-y-2 md:border-y-0 md:border-x-2 border-[#3a0a0a]
            rounded-xl md:rounded-3xl
            shadow-[0_10px_60px_-10px_rgba(0,0,0,1)]
            overflow-hidden
            mx-4 mb-4
          "
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{
            opacity: exiting ? 0 : 1,
            y: exiting ? -30 : 0,
            scale: exiting ? 0.95 : 1,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-800 to-transparent z-30 shadow-[0_0_10px_red]"></div>

          {/* LEFT: Tab Navigation */}
          <div className="w-full md:w-1/3 flex flex-col relative border-b md:border-b-0 md:border-l border-red-900/30 bg-[#0f0f0f]">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>

            <div className="p-6 md:p-8 relative z-10">
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-red-100/90 mb-6 text-center md:text-right flex items-center justify-center md:justify-start gap-3"
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                <span
                  className="text-4xl text-red-800/40 select-none"
                  style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {headingKanji}
                </span>
                {headingTitle}
              </motion.h2>

              <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 no-scrollbar">
                {TABS_DATA.map((tab: any, index: number) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(index)}
                    className={`
                      relative group flex-shrink-0 md:flex-shrink
                      flex items-center justify-between
                      w-auto md:w-full px-5 py-4 rounded-lg border
                      transition-all duration-300 overflow-hidden
                      ${activeTab === index
                        ? "bg-gradient-to-l from-red-950 to-transparent border-red-800/60 shadow-[inset_0_0_10px_rgba(139,0,0,0.3)]"
                        : "bg-[#151515] border-white/5 hover:border-red-900/30 hover:bg-[#1a1a1a]"}
                    `}
                    whileTap={{ scale: 0.98 }}
                  >
                    {activeTab === index && (
                      <motion.div
                        layoutId="activeTabLine"
                        className="absolute right-0 top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_10px_red]"
                      />
                    )}
                    <span
                      className={`text-base font-medium transition-colors ${activeTab === index ? "text-red-100" : "text-gray-400 group-hover:text-gray-200"}`}
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {tab.title}
                    </span>
                    <span
                      className={`text-xl opacity-30 ml-4 hidden md:block ${activeTab === index ? "text-red-500" : "text-gray-600"}`}
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      {tab.kanji}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="hidden md:block mt-8 pt-6 border-t border-white/5 text-center md:text-right">
                <p className="text-xs text-gray-500" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                  {foundedLabel} {foundedValue}
                </p>
                <div className="flex gap-1 mt-2 opacity-50">
                  <div className="w-1.5 h-1.5 bg-red-800 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-red-800 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-red-800 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Tab Content */}
          <div className="w-full md:w-2/3 p-6 md:p-10 relative flex flex-col bg-gradient-to-br from-[#0a0a0a] to-[#120505]">
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] pointer-events-none"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="h-full flex flex-col"
              >
                <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden border border-red-900/30 shadow-lg mb-6 group">
                  <img
                    src={TABS_DATA[activeTab].image}
                    alt={TABS_DATA[activeTab].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter sepia-[0.2] contrast-110"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/dojo${activeTab}/800/400.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                  <div className="absolute bottom-4 right-4 z-10">
                    <h3
                      className="text-2xl font-bold text-white drop-shadow-md flex items-baseline gap-2"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {TABS_DATA[activeTab].title}
                      <span className="text-sm text-red-400 font-light hidden sm:inline-block">
                        / {TABS_DATA[activeTab].kanji}
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex-1 relative">
                  <div className="absolute -top-2 -right-2 text-4xl text-red-900/20 font-serif">❝</div>

                  <p
                    className="text-gray-300 leading-8 text-justify font-light relative z-10"
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  >
                    {TABS_DATA[activeTab].content}
                  </p>

                  <div className="mt-8 flex justify-end">
                    <button className="group flex items-center gap-2 px-5 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded hover:bg-red-900/40 transition-all duration-300">
                      <span className="text-sm" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                        {moreInfo}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-900 to-transparent z-30 opacity-50"></div>
        </motion.div>
      </motion.div>

      {/* Floating Button Area — identical pattern to Section1 */}
      <div className="w-full fixed bottom-8 left-0 right-0 flex flex-col items-center justify-end z-50 pointer-events-none">

        {/* Guiding Arrows — only shown when section is closed */}
        <AnimatePresence>
          {!isSectionOpen && !exiting && (
            <motion.div
              className="mb-3 pointer-events-none flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.svg
                  key={i}
                  width="28"
                  height="14"
                  viewBox="0 0 28 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, 4, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.25,
                  }}
                >
                  <path
                    d="M4 3L14 10L24 3"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Image Button */}
        <motion.button
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          className="pointer-events-auto relative group flex items-center justify-center outline-none cursor-pointer"
          initial={{ y: 100 }}
          animate={{ y: exiting ? 100 : 0 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-expanded={isSectionOpen}
          aria-controls="main-content-section2"
        >
          <motion.div
            className="relative"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 bg-red-600/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <img
              src="/closed_scroll.png"
              alt="Open Samurai Scroll"
              className="w-[420px] md:w-[480px] h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
              style={{ opacity: isSectionOpen ? 0.4 : 1 }}
            />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
