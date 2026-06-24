"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import type { GlobalMessages } from "@/types/messages";

const FALLBACK_TABS = [
  { id: 0, title: "تاریخچه", kanji: "歴史", content: "دوجو ما بیش از ۵۰ سال است که در زمینه هنرهای رزمی ژاپنی فعالیت دارد. این مکان توسط اولین استاد ما تأسیس شد که پس از سال‌ها تمرین در ژاپن، به ایران بازگشت تا دانش خود را با علاقه‌مندان به اشتراک بگذارد.", image: "/history.jpg" },
  { id: 1, title: "فلسفه ما", kanji: "哲学", content: "ما بر اصول بوشیدو - راه جنگجو - تأکید داریم: صداقت، شجاعت، احترام، و وفاداری. این اصول نه تنها در تمرینات ما، بلکه در زندگی روزمره دانش‌آموزان ما نیز نفوذ می‌کند.", image: "/philosophy.jpg" },
  { id: 2, title: "استادان ما", kanji: "師範", content: "تیم ما متشکل از استادان مجرب با سال‌ها تجربه در هنرهای رزمی مختلف است. هر استاد در یک زمینه خاص تخصص دارد و با اشتیاق به دانش‌آموزان خود آموزش می‌دهد.", image: "/masters.jpg" },
  { id: 3, title: "دستاوردها", kanji: "成果", content: "دانش‌آموزان ما موفق به کسب جوایز متعدد در مسابقات ملی و بین‌المللی شده‌اند. اما بزرگترین دستاورد ما، رشد و توسعه شخصیتی صدها دانش‌آموز است.", image: "/achievements.jpg" },
];

export default function Section2({ exiting, messages }: { exiting: boolean; messages?: GlobalMessages }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isSectionOpen, setIsSectionOpen] = useState(false); // State for toggle
  const t = messages?.Section2 as any;

  const TABS_DATA = useMemo(() => {
    const fromJson = t?.tabs?.filter(Boolean);
    return fromJson?.length ? fromJson : FALLBACK_TABS;
  }, [t?.tabs]);

  const headingTitle = t?.heading?.title ?? "درباره ما";
  const headingKanji = t?.heading?.kanji ?? "私たち";
  const foundedLabel = t?.founded?.label ?? "تأسیس:";
  const foundedValue = t?.founded?.value ?? "۱۳۵۰ خورشیدی";
  const moreInfo = t?.moreInfo ?? "اطلاعات بیشتر";

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-16 md:py-0" id="about">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10"></div>

        <motion.div
          className="absolute inset-0 bg-cover bg-center fixed"
          style={{ backgroundImage: "url('/about_bg.webp')", zIndex: 0 }}
          animate={{ scale: exiting ? 1.2 : 1, opacity: exiting ? 0.8 : 1 }}
          initial={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        <div className="absolute top-5 left-5 text-red-950/20 text-8xl font-black select-none z-0">道</div>
        <div className="absolute bottom-5 right-5 text-red-950/20 text-8xl font-black select-none z-0">場</div>
      </div>

      {/* --- THE SAMURAI SCROLL BUTTON --- */}
      <motion.button
        onClick={() => setIsSectionOpen(!isSectionOpen)}
        className="relative z-50 mb-6 group cursor-pointer outline-none overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.1)] border border-[#5a1a1a]"
        style={{ 
          width: '280px', 
          height: '64px',
          background: 'linear-gradient(to bottom, #4a1111 0%, #2d0808 50%, #140303 100%)',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: exiting ? 0 : 1, opacity: exiting ? 0 : 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff5555]/50 to-transparent opacity-70"></div>
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-black/80 to-transparent opacity-80"></div>
        
        <div className="relative z-10 flex items-center justify-center gap-4 h-full w-full text-red-50">
          <motion.div 
            className="w-10 h-10 rounded-full border border-[#ffd700]/40 bg-[#1a0505] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
            animate={{ rotate: isSectionOpen ? 180 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#ffd700] font-bold text-xl" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              {isSectionOpen ? "閉" : "開"}
            </span>
          </motion.div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-red-300/60 uppercase tracking-widest font-semibold">
              {isSectionOpen ? "بستن" : "دستور استاد"}
            </span>
            <span className="text-lg font-bold tracking-wide text-red-100 drop-shadow-md" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
              {isSectionOpen ? "مخفی کردن بخش" : "باز کردن طومار"}
            </span>
          </div>
        </div>
        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-red-900/60 blur-[0.5px]"
          animate={{ opacity: isSectionOpen ? 0 : 0.8 }}
        />
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-red-900/60 blur-[0.5px]"
          animate={{ opacity: isSectionOpen ? 0 : 0.8 }}
        />
      </motion.button>

      {/* --- CONTENT WRAPPER --- */}
      <motion.div
        layout
        className="w-full flex justify-center overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: (isSectionOpen && !exiting) ? "auto" : 0,
          opacity: (isSectionOpen && !exiting) ? 1 : 0,
        }}
        transition={{ 
          height: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }, 
          opacity: { duration: 0.5, delay: isSectionOpen ? 0.2 : 0 } 
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
            mx-4
          "
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: exiting ? 0 : 1, y: exiting ? -30 : 0, scale: exiting ? 0.95 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-800 to-transparent z-30 shadow-[0_0_10px_red]"></div>

          <div className="w-full md:w-1/3 flex flex-col relative border-b md:border-b-0 md:border-l border-red-900/30 bg-[#0f0f0f]">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none"></div>

            <div className="p-6 md:p-8 relative z-10">
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-red-100/90 mb-6 text-center md:text-right flex items-center justify-center md:justify-start gap-3"
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                <span className="text-4xl text-red-800/40 select-none" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
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
                      <motion.div layoutId="activeTabLine" className="absolute right-0 top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_10px_red]" />
                    )}

                    <span className={`text-base font-medium transition-colors ${activeTab === index ? "text-red-100" : "text-gray-400 group-hover:text-gray-200"}`} style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                      {tab.title}
                    </span>
                    <span className={`text-xl opacity-30 ml-4 hidden md:block ${activeTab === index ? "text-red-500" : "text-gray-600"}`} style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
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
                    <h3 className="text-2xl font-bold text-white drop-shadow-md flex items-baseline gap-2" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                      {TABS_DATA[activeTab].title}
                      <span className="text-sm text-red-400 font-light hidden sm:inline-block">/ {TABS_DATA[activeTab].kanji}</span>
                    </h3>
                  </div>
                </div>

                <div className="flex-1 relative">
                  <div className="absolute -top-2 -right-2 text-4xl text-red-900/20 font-serif">❝</div>

                  <p className="text-gray-300 leading-8 text-justify font-light relative z-10" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                    {TABS_DATA[activeTab].content}
                  </p>

                  <div className="mt-8 flex justify-end">
                    <button className="group flex items-center gap-2 px-5 py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded hover:bg-red-900/40 transition-all duration-300">
                      <span className="text-sm" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                        {moreInfo}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1">
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
    </div>
  );
}