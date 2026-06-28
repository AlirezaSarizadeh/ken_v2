"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { GlobalMessages } from "@/types/messages";
import type { DojoApiData } from "@/types/api";
import SafeImg from "@/app/components/ui/SafeImg";

const FALLBACK_CATEGORIES_FA = ["همه", "سلاح", "سلاح تمرینی", "زره", "هنر"];

const FALLBACK_ITEMS_FA = [
  {
    id: 1,
    name: "کاتانای باستانی",
    kanji: "刀",
    description: "تیغه‌ای از فولاد تاماهاگانه، بازمانده از نبردهای دوران ادو.",
    origin: "دوره ادو",
    material: "فولاد تاماهاگانه",
    image: "/katana.jpg",
    category: "سلاح",
  },
  {
    id: 2,
    name: "شینای بامبو",
    kanji: "竹刀",
    description: "شمشیر تمرینی کندو، نماد انضباط و روحیه ورزشکاری.",
    origin: "کیوتو",
    material: "بامبو، چرم",
    image: "/shinai.jpg",
    category: "سلاح تمرینی",
  },
  {
    id: 3,
    name: "بُکُن چوبی",
    kanji: "木剣",
    description: "شمشیر چوب بلوط برای تمرین کاتا و تقویت تمرکز.",
    origin: "اوکیناوا",
    material: "چوب بلوط سفید",
    image: "/bokken.jpg",
    category: "سلاح تمرینی",
  },
  {
    id: 4,
    name: "ماسک منپو",
    kanji: "面",
    description: "ماسک ترسناک جنگجویان برای محافظت و ایجاد رعب در دل دشمن.",
    origin: "دوره سنگوکو",
    material: "آهن و لاک",
    image: "/menpo.jpg",
    category: "زره",
  },
  {
    id: 5,
    name: "کالوگرافی بوشیدو",
    kanji: "書道",
    description: "اثر هنری با مرکب سیاه، نمایانگر روح و طریقت جنگجو.",
    origin: "توکیو",
    material: "کاغذ واشی",
    image: "/calligraphy.jpg",
    category: "هنر",
  },
  {
    id: 6,
    name: "زره یوروی",
    kanji: "鎧",
    description: "زره کامل فرماندهان، ترکیبی از هنر و استحکام.",
    origin: "دوره سنگوکو",
    material: "آهن، ابریشم",
    image: "/armor.jpg",
    category: "زره",
  },
];

type GalleryItem = {
  id: number;
  name: string;
  kanji: string;
  description: string;
  origin: string;
  material: string;
  image: string;
  category: string;
};

export default function Section5({
  exiting,
  messages,
  apiData,
}: {
  exiting: boolean;
  messages?: GlobalMessages;
  apiData?: DojoApiData;
}) {
  const t = messages?.Section5 as any;

  const [isSectionOpen, setIsSectionOpen] = useState(false);

  const allKey: string = t?.allKey ?? "همه";

  const CATEGORIES: string[] = useMemo(() => {
    const fromApi = apiData?.galleryCategories?.filter(Boolean).map(
      (c: any) => c.title ?? c.name ?? c.slug ?? ""
    ).filter(Boolean);
    if (fromApi?.length) return [allKey, ...fromApi];
    const fromJson = t?.categories?.filter(Boolean);
    return fromJson?.length ? fromJson : FALLBACK_CATEGORIES_FA;
  }, [apiData?.galleryCategories, t?.categories, allKey]);

  const GALLERY_ITEMS: GalleryItem[] = useMemo(() => {
    const fromApi = apiData?.galleryItems?.filter(Boolean).map((item: any) => ({
      id: item.id ?? Math.random(),
      name: item.title ?? item.name ?? "",
      kanji: item.kanji ?? "",
      description: item.description ?? "",
      origin: item.origin ?? "",
      material: item.material ?? "",
      image: item.image ?? item.thumbnail ?? "",
      category: item.category ?? "",
    }));
    if (fromApi?.length) return fromApi as GalleryItem[];
    const fromJson = t?.items?.filter(Boolean);
    return fromJson?.length ? fromJson : (FALLBACK_ITEMS_FA as GalleryItem[]);
  }, [apiData?.galleryItems, t?.items]);

  const headingTitle: string = t?.heading?.title ?? "گنجینه دوجو";
  const headingSubtitle: string = t?.heading?.subtitle ?? "Artifacts & Weapons";

  const [activeCategory, setActiveCategory] = useState<string>(allKey);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [lightboxId, setLightboxId] = useState<number | null>(null);

  useEffect(() => {
    setActiveCategory((prev) => (CATEGORIES.includes(prev) ? prev : allKey));
  }, [allKey, CATEGORIES]);

  const safeActiveCategory = CATEGORIES.includes(activeCategory) ? activeCategory : allKey;

  const filteredItems =
    safeActiveCategory === allKey
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === safeActiveCategory);

  const lightboxItem = lightboxId !== null ? filteredItems.find((i) => i.id === lightboxId) ?? null : null;
  const lightboxIdx = lightboxId !== null ? filteredItems.findIndex((i) => i.id === lightboxId) : -1;

  return (
    <div
      className="w-full min-h-full flex flex-col items-center justify-center relative py-16 md:py-0 overflow-hidden"
      id="gallery"
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10" />
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/gallery_bg.webp')", zIndex: 0 }}
          animate={{ scale: exiting ? 1.2 : 1, opacity: exiting ? 0.8 : 1 }}
          initial={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <div className="absolute top-5 end-10 text-red-950/30 text-9xl font-black select-none z-0">美</div>
        <div className="absolute bottom-10 start-10 text-red-950/30 text-9xl font-black select-none z-0">術</div>
      </div>

      {/* Content Wrapper */}
      <motion.div
        id="main-content-section5"
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
            w-full max-w-7xl
            flex flex-col
            bg-[#080808]/80 backdrop-blur-sm
            border border-red-900/30
            rounded-xl md:rounded-3xl
            shadow-[0_0_50px_-10px_rgba(0,0,0,1)]
            overflow-hidden
            mx-4 mb-4
          "
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{
            opacity: exiting ? 0 : 1,
            y: exiting ? -50 : 0,
            scale: exiting ? 0.95 : 1,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-800 to-transparent z-30 shadow-[0_0_15px_red]" />

          {/* Header & Filter */}
          <div className="w-full p-6 md:p-10 flex flex-col items-center border-b border-white/5 bg-[#0f0f0f]">
            <h2
              className="text-3xl md:text-4xl font-bold text-red-100/90 mb-8 text-center flex flex-col items-center"
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              {headingTitle}
              <span className="text-sm text-red-500/60 mt-2 font-light tracking-widest uppercase">
                {headingSubtitle}
              </span>
            </h2>

            <div className="flex flex-nowrap overflow-x-auto pb-1 justify-start md:justify-center gap-2 md:gap-4 relative z-20 scrollbar-none px-1" style={{ scrollbarWidth: "none" }}>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    relative px-4 py-2 rounded-full text-sm transition-colors duration-300
                    ${safeActiveCategory === category ? "text-white" : "text-gray-500 hover:text-gray-300"}
                  `}
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {safeActiveCategory === category && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-red-900/40 border border-red-700/50 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="flex-1 p-6 md:p-10 overflow-y-scroll moz">
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative h-72 rounded-xl overflow-hidden cursor-pointer border border-white/5 bg-[#0c0c0c]"
                    onClick={() => setLightboxId(item.id)}
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <SafeImg
                        src={item.image}
                        alt={item.name}
                        className={`
                          w-full h-full object-cover transition-all duration-700
                          ${hoveredItem === item.id ? "scale-110" : "scale-100 grayscale-[50%] sepia-[30%] brightness-75"}
                        `}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/artifact${item.id}/400/300.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-70" />
                    </div>

                    <div className="absolute top-2 end-2 w-8 h-8 border-t-2 border-e-2 border-red-500/0 group-hover:border-red-500/50 transition-all duration-500 rounded-tr-lg" />
                    <div className="absolute bottom-2 start-2 w-8 h-8 border-b-2 border-s-2 border-red-500/0 group-hover:border-red-500/50 transition-all duration-500 rounded-bl-lg" />

                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="absolute top-4 end-4 text-6xl text-white/5 font-black group-hover:text-red-600/10 transition-colors duration-500 select-none">
                        {item.kanji}
                      </div>

                      <motion.div
                        animate={{ y: hoveredItem === item.id ? 0 : 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3
                          className="text-xl font-bold text-white mb-1 drop-shadow-md flex items-center gap-2"
                          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                        >
                          {item.name}
                          {hoveredItem === item.id && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-xs text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3.5 h-3.5 opacity-80"
                                aria-hidden="true"
                              >
                                <path d="M12 2c3.866 0 7 3.134 7 7 0 5.25-7 13-7 13S5 14.25 5 9c0-3.866 3.134-7 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                              </svg>
                              {item.origin}
                            </motion.span>
                          )}
                        </h3>

                        <p
                          className={`text-sm text-gray-300 line-clamp-2 transition-all duration-300 ${
                            hoveredItem === item.id ? "opacity-100 max-h-20" : "opacity-70 max-h-10"
                          }`}
                          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                        >
                          {item.description}
                        </p>

                        <div
                          className={`mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 transition-all duration-300 ${
                            hoveredItem === item.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-3.5 h-3.5 opacity-70"
                              aria-hidden="true"
                            >
                              <path d="M12 2 2 7v10l10 5 10-5V7L12 2Zm0 2.18L19.764 8 12 11.82 4.236 8 12 4.18ZM4 9.618l7 3.5V20.7l-7-3.5V9.618Zm9 11.082v-7.582l7-3.5V17.2l-7 3.5Z" />
                            </svg>
                            {item.material}
                          </span>
                          <span className="text-red-400 font-mono">ID: 00{item.id}</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-900 to-transparent z-30 opacity-50" />
        </motion.div>
      </motion.div>

      {/* Gallery Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxId(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl bg-[#0a0a0a] border border-red-900/30 rounded-xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-700 to-transparent opacity-60" />

              <div className="relative w-full max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
                <SafeImg
                  src={lightboxItem.image}
                  alt={lightboxItem.name}
                  className="w-full max-h-[65vh] object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none opacity-50" />
              </div>

              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-lg font-bold text-white mb-1 truncate"
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  >
                    {lightboxItem.name}
                    {lightboxItem.kanji && (
                      <span
                        className="ms-2 text-red-900/50 text-2xl align-middle"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
                        {lightboxItem.kanji}
                      </span>
                    )}
                  </h3>
                  {lightboxItem.description && (
                    <p
                      className="text-sm text-gray-400 line-clamp-2"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {lightboxItem.description}
                    </p>
                  )}
                </div>

                {/* dir="ltr" keeps ← always left and → always right in both RTL/LTR */}
                <div className="flex items-center gap-2 flex-shrink-0" dir="ltr">
                  {/* Prev — left arrow → previous item */}
                  <button
                    onClick={() => lightboxIdx > 0 && setLightboxId(filteredItems[lightboxIdx - 1].id)}
                    disabled={lightboxIdx <= 0}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white"
                    aria-label="Previous"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Next — right arrow → next item */}
                  <button
                    onClick={() => lightboxIdx < filteredItems.length - 1 && setLightboxId(filteredItems[lightboxIdx + 1].id)}
                    disabled={lightboxIdx >= filteredItems.length - 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition text-white"
                    aria-label="Next"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => setLightboxId(null)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-red-900/30 transition text-red-200"
                    aria-label="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div className="w-full fixed bottom-8 left-0 right-0 flex flex-col items-center z-50 pointer-events-none">
        {/* Guiding Arrows */}
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
          transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 15 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-expanded={isSectionOpen}
          aria-controls="main-content-section5"
        >
          <motion.div
            className="relative"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
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
