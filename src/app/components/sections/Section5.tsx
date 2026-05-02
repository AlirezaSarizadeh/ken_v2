"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { GlobalMessages } from "@/types/messages";

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
}: {
  exiting: boolean;
  messages?: GlobalMessages;
}) {
  const t = messages?.Section5 as any;

  const [isSectionOpen, setIsSectionOpen] = useState(false); 

  const allKey: string = t?.allKey ?? "همه";

  const CATEGORIES: string[] = useMemo(() => {
    const fromJson = t?.categories?.filter(Boolean);
    return fromJson?.length ? fromJson : FALLBACK_CATEGORIES_FA;
  }, [t?.categories]);

  const GALLERY_ITEMS: GalleryItem[] = useMemo(() => {
    const fromJson = t?.items?.filter(Boolean);
    return fromJson?.length ? fromJson : (FALLBACK_ITEMS_FA as GalleryItem[]);
  }, [t?.items]);

  const headingTitle: string = t?.heading?.title ?? "گنجینه دوجو";
  const headingSubtitle: string = t?.heading?.subtitle ?? "Artifacts & Weapons";

  const [activeCategory, setActiveCategory] = useState<string>(allKey);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  useEffect(() => {
    setActiveCategory((prev) => (CATEGORIES.includes(prev) ? prev : allKey));
  }, [allKey, CATEGORIES]);

  const safeActiveCategory = CATEGORIES.includes(activeCategory) ? activeCategory : allKey;

  const filteredItems =
    safeActiveCategory === allKey
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === safeActiveCategory);

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-16 md:py-0" id="gallery">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10" />

        <motion.div
          className="absolute inset-0 bg-cover bg-center fixed"
          style={{ backgroundImage: "url('/gallery_bg.webp')", zIndex: 0 }}
          animate={{ scale: exiting ? 1.2 : 1, opacity: exiting ? 0.8 : 1 }}
          initial={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, #000000 90%) z-5 opacity-80" />

        <div className="absolute top-5 end-10 text-red-950/30 text-9xl font-black select-none z-0">美</div>
        <div className="absolute bottom-10 start-10 text-red-950/30 text-9xl font-black select-none z-0">術</div>
      </div>

      {/* --- BUTTON --- */}
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
            w-full max-w-7xl 
            flex flex-col 
            bg-[#080808]/80 backdrop-blur-sm
            border border-red-900/30
            rounded-xl md:rounded-3xl 
            shadow-[0_0_50px_-10px_rgba(0,0,0,1)]
            overflow-hidden
            mx-4
          "
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: exiting ? 0 : 1, y: exiting ? -50 : 0, scale: exiting ? 0.95 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-800 to-transparent z-30 shadow-[0_0_15px:red]" />

          {/* --- Header & Filter --- */}
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

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 relative z-20">
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

          {/* --- Gallery Grid --- */}
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
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`
                          w-full h-full object-cover transition-all duration-700
                          ${hoveredItem === item.id ? "scale-110 filter:none" : "scale-100 grayscale-[50%] sepia-[30%] brightness-75"}
                        `}
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/artifact${item.id}/400/300.jpg`;
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

                      <motion.div animate={{ y: hoveredItem === item.id ? 0 : 10 }} transition={{ duration: 0.3 }}>
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
    </div>
  );
}