"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";

import type { GlobalMessages } from "@/types/messages";
import type { DojoApiData } from "@/types/api";
import SafeImg from "@/app/components/ui/SafeImg";

import "swiper/css";
import "swiper/css/effect-cards";

const FALLBACK_SLIDES = [
  { id: 1, title: "کد بوشیدو", desc: "راه جنگجو بر افتخار، شجاعت و مهربانی تأکید دارد.", image: "/pic_1.jpg", kanji: "武士道" },
  { id: 2, title: "استادی در کاتانا", desc: "کاتانا بیشتر از یک سلاح است - ادامه روح سامورایی است.", image: "/pic_2.jpg", kanji: "刀" },
  { id: 3, title: "فلسفه زن", desc: "تمرین ذهن برای رسیدن به وضوح در نبرد و زندگی.", image: "/pic_3.jpg", kanji: "禅" },
  { id: 4, title: "افتخار بالاتر از همه", desc: "اعتبار یک سامورایی ارزشمندترین دارایی اوست.", image: "/pic_4.jpg", kanji: "名誉" },
];

export default function Section1({
  exiting,
  messages,
  apiData,
}: {
  exiting: boolean;
  messages?: GlobalMessages;
  apiData?: DojoApiData;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSectionOpen, setIsSectionOpen] = useState(false);

  const t = messages?.Section1 as any;
  const home = apiData?.homeData;

  const SLIDE_DATA = useMemo(() => {
    const fromApi = home?.slides?.filter(Boolean).map((s: any) => ({
      id: s.id ?? Math.random(),
      title: s.title ?? "",
      desc: s.desc ?? s.description ?? "",
      image: s.image ?? "",
      kanji: s.kanji ?? "",
    }));
    if (fromApi?.length) return fromApi;
    const fromJson = t?.slides?.filter(Boolean);
    return fromJson?.length ? fromJson : FALLBACK_SLIDES;
  }, [home?.slides, t?.slides]);

  const masterTitlePrefix = home?.master?.titlePrefix ?? t?.master?.titlePrefix ?? "شیهان";
  const masterName = home?.master?.name ?? t?.master?.name ?? "اشرفی";
  const masterQuote =
    home?.master?.quote ??
    t?.master?.quote ??
    "راهِ جنگجو از دلِ رویارویی با مرگ می‌گذرد؛ کسی که از مرگ نمی‌گریزد، در نهایت زندگی را تمام‌قد در آغوش می‌گیرد.";
  const masterAlt = t?.master?.imageAlt ?? "Shihan";
  // API hero.image replaces static shihan photo when available
  const masterImage = (home?.master as any)?.image ?? null;

  const headerP1 = t?.header?.titlePart1 ?? "راه";
  const headerP2 = t?.header?.titlePart2 ?? "سامورایی";
  const floatTop = t?.header?.floatingKanjiTop ?? "武";
  const floatBottom = t?.header?.floatingKanjiBottom ?? "士";
  const headerKanji = t?.header?.headerKanji ?? "侍";

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-12 md:py-0 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10"></div>

        <motion.div
          className="absolute inset-0 bg-cover bg-center fixed"
          style={{ backgroundImage: "url('/sec1_bg.webp')", zIndex: 0 }}
          animate={{ scale: exiting ? 1.1 : 1, opacity: exiting ? 0.5 : 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.div
          className="hidden md:block absolute top-10 left-10 text-red-950/30 text-9xl font-black select-none z-0 filter blur-sm"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          {floatTop}
        </motion.div>

        <motion.div
          className="hidden md:block absolute bottom-5 right-5 text-red-950/30 text-9xl font-black select-none z-0 filter blur-sm"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          {floatBottom}
        </motion.div>
      </div>

      {/* Content Wrapper */}
      <motion.div
        id="main-content-section"
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
            w-full max-w-5xl 
            flex flex-col md:flex-row 
            bg-[#0a0a0a]
            border-y-2 md:border-y-0 md:border-x-2 border-[#3a0a0a]
            rounded-xl md:rounded-3xl 
            shadow-[0_10px_60px_-10px_rgba(0,0,0,1),0_0_20px_rgba(139,0,0,0.3)_inset]
            overflow-hidden mb-4
          "
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{
            opacity: exiting ? 0 : 1,
            scale: exiting ? 0.95 : 1,
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-800 to-transparent z-30 shadow-[0_0_10px_red]"></div>

          {/* LEFT: Master Info */}
          <div className="w-full md:w-2/5 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2d0808_0%,#000000_100%)] opacity-80 z-0"></div>
            <div className="absolute right-0 h-full w-[2px] bg-gradient-to-b from-transparent via-red-900/50 to-transparent hidden md:block z-10"></div>

            <motion.h2
              className="relative z-10 text-2xl md:text-3xl font-bold text-red-100/90 mb-8 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              <span className="text-red-600">{masterTitlePrefix}</span> {masterName}
            </motion.h2>

            <div className="relative z-10 w-48 h-48 md:w-60 md:h-60 rounded-full group">
              <motion.div
                className="absolute -inset-3 rounded-full border-[3px] border-red-900/60"
                style={{ boxShadow: "0 0 20px rgba(139,0,0,0.4), inset 0 0 10px rgba(0,0,0,0.8)" }}
                animate={{
                  borderColor: [
                    "rgba(127, 29, 29, 0.6)",
                    "rgba(185, 28, 28, 0.8)",
                    "rgba(127, 29, 29, 0.6)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#1a1a1a] relative z-10 bg-black shadow-[0_0_30px_black_inset]">
                {/* Static fallback: src="/shihan-new.jpg" — preserved below; API hero.image takes priority when available */}
                <SafeImg
                  src={masterImage ?? "/shihan-new.jpg"}
                  alt={masterAlt}
                  className="w-full h-full object-cover grayscale-[30%] contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/shihan-new.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/50 to-transparent mix-blend-overlay"></div>
                <div className="absolute inset-0 border border-white/5 rounded-full pointer-events-none"></div>
              </div>
            </div>

            <motion.div
              className="relative z-10 mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p
                className="text-red-50/70 text-sm md:text-base leading-relaxed italic max-w-xs mx-auto relative px-4 py-2"
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                <span className="absolute top-0 left-0 text-2xl text-red-800 opacity-50">"</span>
                {masterQuote}
                <span className="absolute bottom-0 right-0 text-2xl text-red-800 opacity-50 translate-y-2">"</span>
              </p>
            </motion.div>
          </div>

          {/* RIGHT: Swiper Cards */}
          <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[#050505] z-0"></div>
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] z-0"></div>

            <div className="w-full relative z-10 flex justify-between items-end mb-8 pb-3 border-b-2 border-red-900/30 shadow-[0_2px_0_black]">
              <h2 className="text-2xl md:text-3xl font-bold text-red-50" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                <span className="text-red-700">{headerP1}</span> {headerP2}
              </h2>
              <span
                className="text-6xl text-red-950/50 font-black select-none absolute left-0 -bottom-3 -z-10"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {headerKanji}
              </span>
            </div>

            <div className="w-full max-w-[280px] sm:max-w-[320px] h-[420px] z-10">
              <Swiper
                key={isSectionOpen ? "open" : "closed"}
                effect={"cards"}
                grabCursor
                modules={[EffectCards]}
                className="mySwiper w-full h-full py-4"
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              >
                {SLIDE_DATA.map((slide: any) => (
                  <SwiperSlide
                    key={slide.id}
                    className="rounded-lg overflow-hidden bg-[#0c0c0c] border-[1px] border-[#2a0a0a] shadow-[0_5px_20px_-5px_rgba(0,0,0,1)]"
                    style={{ backgroundImage: "linear-gradient(135deg, #1a0505 0%, #000000 100%)" }}
                  >
                    <div className="h-full flex flex-col relative">
                      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')] mix-blend-overlay z-20"></div>

                      <div className="h-[52%] relative group overflow-hidden border-b-2 border-red-900/50">
                        <div
                          className="absolute top-1 right-2 z-10 text-7xl text-red-950/80 font-black drop-shadow-lg select-none opacity-70"
                          style={{ fontFamily: "'Noto Sans JP', sans-serif", transform: "rotate(-10deg)" }}
                        >
                          {slide.kanji}
                        </div>

                        <SafeImg
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-[0.8] contrast-125 sepia-[0.3] saturate-[0.8]"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/samurai${slide.id}/500/300.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0000] via-transparent to-black/40 opacity-90"></div>
                        <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-red-900/40 to-transparent"></div>
                      </div>

                      <div className="h-[48%] p-5 flex flex-col justify-between relative z-10 bg-gradient-to-b from-[#0a0000] to-[#050505]">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-red-900/20 border border-red-800/60 rounded-sm transform rotate-45">
                              <span className="text-red-500 text-sm font-mono font-bold transform -rotate-45">0{slide.id}</span>
                            </div>
                            <h3 className="text-xl font-bold text-red-50/90 tracking-wide" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                              {slide.title}
                            </h3>
                          </div>
                          <div className="w-full h-[2px] bg-gradient-to-r from-red-900/80 via-red-700/40 to-transparent mb-3 opacity-70"></div>
                          <p className="text-red-100/60 text-sm leading-7 font-light" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                            {slide.desc}
                          </p>
                        </div>

                        <div className="flex gap-2 mt-auto pt-4 items-center justify-end opacity-60">
                          {SLIDE_DATA.map((_: any, i: number) => (
                            <div
                              key={i}
                              className={`h-1.5 rounded-sm transition-all duration-500 ${i === activeIndex ? "w-8 bg-red-600/80" : "w-3 bg-red-950"}`}
                              style={{ borderRadius: "2px 8px 4px 6px" }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-900/80 to-transparent z-30 shadow-[0_0_15px_rgba(139,0,0,0.5)]"></div>
        </motion.div>
      </motion.div>

      {/* Floating Button Area */}
      <div className="w-full fixed bottom-8 left-0 right-0 flex flex-col items-center justify-end z-50 pointer-events-none">

        {/* Guiding Arrow — only shown when scroll is closed */}
        <AnimatePresence>
          {!isSectionOpen && !exiting && (
            <motion.div
              className="mb-3 pointer-events-none flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
            >
              {/* Three stacked chevrons, fading in sequence — minimal & thematic */}
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
          aria-controls="main-content-section"
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