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
    image: "/product_1.jpg",
    category: "سلاح",
    price: 24500000,
    inStock: true,
    badge: "Special",
  },
  {
    id: 2,
    name: "شینای بامبو",
    kanji: "竹刀",
    description: "شمشیر تمرینی کندو، نماد انضباط و روحیه ورزشکاری.",
    origin: "کیوتو",
    material: "بامبو، چرم",
    image: "/product_1.jpg",
    category: "سلاح تمرینی",
    price: 1850000,
    inStock: true,
    badge: "Best",
  },
  {
    id: 3,
    name: "بُکُن چوبی",
    kanji: "木剣",
    description: "شمشیر چوب بلوط برای تمرین کاتا و تقویت تمرکز.",
    origin: "اوکیناوا",
    material: "چوب بلوط سفید",
    image: "/product_1.jpg",
    category: "سلاح تمرینی",
    price: 1350000,
    inStock: false,
    badge: "Limited",
  },
  {
    id: 4,
    name: "ماسک منپو",
    kanji: "面",
    description: "ماسک جنگجویان برای محافظت و ایجاد رعب در دل دشمن.",
    origin: "دوره سنگوکو",
    material: "آهن و لاک",
    image: "/product_1.jpg",
    category: "زره",
    price: 7900000,
    inStock: true,
    badge: "Armor",
  },
  {
    id: 5,
    name: "کالوگرافی بوشیدو",
    kanji: "書道",
    description: "اثر هنری با مرکب سیاه، نمایانگر روح و طریقت جنگجو.",
    origin: "توکیو",
    material: "کاغذ واشی",
    image: "/product_1.jpg",
    category: "هنر",
    price: 980000,
    inStock: true,
    badge: "Art",
  },
  {
    id: 6,
    name: "زره یوروی",
    kanji: "鎧",
    description: "زره کامل فرماندهان، ترکیبی از هنر و استحکام.",
    origin: "دوره سنگوکو",
    material: "آهن، ابریشم",
    image: "/product_1.jpg",
    category: "زره",
    price: 16900000,
    inStock: true,
    badge: "Premium",
  },
];

type ShopItem = {
  id: number;
  name: string;
  kanji: string;
  description: string;
  origin: string;
  material: string;
  image: string;
  category: string;
  price: number;
  inStock: boolean;
  badge?: string;
};

function formatPriceIRR(n: number) {
  return n.toLocaleString("fa-IR");
}

export default function SectionShop({
  exiting,
  messages,
}: {
  exiting: boolean;
  messages?: GlobalMessages;
}) {
  const [isSectionOpen, setIsSectionOpen] = useState(false); 
  const t = (messages?.SectionShop ?? {}) as any;

  const allKey: string = t?.allKey ?? "همه";

  const CATEGORIES: string[] = useMemo(() => {
    const fromJson = t?.categories?.filter(Boolean);
    return fromJson?.length ? fromJson : FALLBACK_CATEGORIES_FA;
  }, [t?.categories]);

  const ITEMS: ShopItem[] = useMemo(() => {
    const fromJson = t?.items?.filter(Boolean);
    return fromJson?.length ? fromJson : (FALLBACK_ITEMS_FA as ShopItem[]);
  }, [t?.items]);

  const headingTitle: string = t?.heading?.title ?? "فروشگاه ابزار کنجوتسو";
  const headingSubtitle: string = t?.heading?.subtitle ?? "Kenjutsu Gear Shop";

  const ui = {
    searchPlaceholder: t?.ui?.searchPlaceholder ?? "جستجو ابزار…",
    addToCart: t?.ui?.addToCart ?? "افزودن به سبد",
    outOfStock: t?.ui?.outOfStock ?? "ناموجود",
    details: t?.ui?.details ?? "جزئیات",
    close: t?.ui?.close ?? "بستن",
    currency: t?.ui?.currency ?? "تومان",
  };

  const [activeCategory, setActiveCategory] = useState<string>(allKey);
  const [query, setQuery] = useState("");
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [modalId, setModalId] = useState<number | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({});

  useEffect(() => {
    setActiveCategory((prev) => (CATEGORIES.includes(prev) ? prev : allKey));
  }, [allKey, CATEGORIES]);

  const safeActiveCategory = CATEGORIES.includes(activeCategory)
    ? activeCategory
    : allKey;

  const baseFiltered =
    safeActiveCategory === allKey
      ? ITEMS
      : ITEMS.filter((it) => it.category === safeActiveCategory);

  const searched = query.trim()
    ? baseFiltered.filter((it) => {
        const q = query.trim().toLowerCase();
        return (
          it.name.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q) ||
          it.material.toLowerCase().includes(q) ||
          it.origin.toLowerCase().includes(q) ||
          it.kanji.toLowerCase().includes(q)
        );
      })
    : baseFiltered;

  const activeItem = modalId ? ITEMS.find((x) => x.id === modalId) : null;

  function addToCart(item: ShopItem) {
    if (!item.inStock) return;
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] ?? 0) + 1 }));
  }

  const cartCount = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart],
  );

  return (
    <div
      className="w-full min-h-full flex flex-col items-center justify-center relative py-16 md:py-0"
      id="shop"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10" />

        <motion.div
          className="absolute inset-0 bg-cover bg-center fixed"
          style={{ backgroundImage: "url('/store_bg.png')", zIndex: 0 }}
          animate={{ scale: exiting ? 1.2 : 1, opacity: exiting ? 0.8 : 1 }}
          initial={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, #000000 90%) z-5 opacity-80" />

        <div className="absolute top-5 end-10 text-red-950/25 text-9xl font-black select-none z-0">
          商
        </div>
        <div className="absolute bottom-10 start-10 text-red-950/25 text-9xl font-black select-none z-0">
          品
        </div>
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
          animate={{
            opacity: exiting ? 0 : 1,
            y: exiting ? -50 : 0,
            scale: exiting ? 0.95 : 1,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-800 to-transparent z-30 shadow-[0_0_15px:red]" />

          {/* Header */}
          <div className="w-full p-6 md:p-10 flex flex-col items-center border-b border-white/5 bg-[#0f0f0f]">
            <div className="w-full flex items-center justify-between gap-4">
              <div className="flex-1">
                <h2
                  className="text-3xl md:text-4xl font-bold text-red-100/90 mb-2 text-center md:text-center"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {headingTitle}
                </h2>
                <div className="text-center md:text-center">
                  <span className="text-sm text-red-500/60 font-light tracking-widest uppercase">
                    {headingSubtitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="w-full mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={ui.searchPlaceholder}
                  className="
                    w-full
                    bg-black/50
                    border border-red-900/35
                    rounded-2xl
                    ps-11 pe-4 py-3
                    text-red-50/90
                    outline-none
                    focus:border-red-600/60
                    focus:ring-2 focus:ring-red-900/25
                  "
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                />
                <div className="absolute inset-y-0 start-4 flex items-center text-red-300/60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3a7.5 7.5 0 1 0 4.42 13.56l3.26 3.26a.75.75 0 1 0 1.06-1.06l-3.26-3.26A7.5 7.5 0 0 0 10.5 3Zm-6 7.5a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 md:gap-4 relative z-20">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    relative px-4 py-2 rounded-full text-sm transition-colors duration-300
                    ${
                      safeActiveCategory === category
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }
                  `}
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {safeActiveCategory === category && (
                    <motion.div
                      layoutId="activeShopFilter"
                      className="absolute inset-0 bg-red-900/40 border border-red-700/50 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 p-6 md:p-10 overflow-y-scroll moz">
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
              <AnimatePresence mode="popLayout">
                {searched.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.25 }}
                    className="
                      group relative h-[22rem]
                      overflow-hidden
                      border border-white/5 bg-[#0c0c0c]
                      shadow-[0_20px_60px_-45px_rgba(0,0,0,1)]
                    "
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    {/* Media */}
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`
                          w-full h-full object-contain transition-all duration-700
                          ${
                            hoveredItem === item.id
                              ? "scale-110 filter:none"
                              : "scale-100 grayscale-[35%] sepia-[20%] brightness-75"
                          }
                        `}
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/gear${item.id}/800/600.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-80" />
                    </div>

                    {/* Kanji watermark */}
                    <div className="absolute top-4 end-4 text-7xl text-white/5 font-black group-hover:text-red-600/10 transition-colors duration-500 select-none">
                      {item.kanji}
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <motion.div
                        animate={{ y: hoveredItem === item.id ? 0 : 10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3
                            className="text-xl font-bold text-white drop-shadow-md"
                            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                          >
                            {item.name}
                          </h3>

                          <div className="text-end">
                            <div className="text-xs text-red-200/70 font-mono">
                              ID: 00{item.id}
                            </div>
                          </div>
                        </div>

                        <p
                          className={`
                            mt-2 text-sm text-gray-300 line-clamp-2 transition-all duration-300
                            ${
                              hoveredItem === item.id
                                ? "opacity-100"
                                : "opacity-75"
                            }
                          `}
                          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                        >
                          {item.description}
                        </p>

                        {/* meta */}
                        <div
                          className={`
                            mt-3 pt-3 border-t border-white/10
                            flex items-center justify-between gap-3 text-xs text-gray-400
                            transition-all duration-300
                            ${
                              hoveredItem === item.id
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-3"
                            }
                          `}
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

                          <span className="inline-flex items-center gap-1 text-amber-200/70">
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
                          </span>
                        </div>

                        {/* CTA */}
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => setModalId(item.id)}
                            className="
                              flex-1 rounded-2xl py-2.5
                              border text-sm
                              transition border-red-700/40 bg-red-900/35 cursor-pointer hover:bg-red-900/50 text-white
                            "
                            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                          >
                            {ui.details}
                          </button>
                        </div>
                      </motion.div>
                    </div>

                    {/* corners */}
                    <div className="absolute top-2 end-2 w-8 h-8 border-t-2 border-e-2 border-red-500/0 group-hover:border-red-500/50 transition-all duration-500" />
                    <div className="absolute bottom-2 start-2 w-8 h-8 border-b-2 border-s-2 border-red-500/0 group-hover:border-red-500/50 transition-all duration-500" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty state */}
            {searched.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <div className="text-5xl opacity-30">空</div>
                <div
                  className="mt-3 text-sm"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  چیزی پیدا نشد.
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-900 to-transparent z-30 opacity-50" />

          {/* Modal */}
          <AnimatePresence>
            {activeItem && (
              <motion.div
                className="absolute inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={() => setModalId(null)}
                />

                <motion.div
                  initial={{ y: 20, scale: 0.98, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 10, scale: 0.98, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="
                    relative w-full max-w-3xl overflow-hidden
                    border border-red-900/35
                    bg-[#0b0b0b]
                    shadow-[0_40px_120px_-70px_rgba(0,0,0,1)]
                  "
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-64 md:h-full">
                      <img
                        src={activeItem.image}
                        alt={activeItem.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/gearModal${activeItem.id}/1000/800.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                      <div className="absolute top-4 start-4 px-3 py-1 rounded-full text-[11px] border border-red-700/35 bg-black/40 text-red-100/85">
                        {activeItem.category}
                      </div>
                      <div className="absolute bottom-4 start-4 text-6xl text-white/10 font-black select-none">
                        {activeItem.kanji}
                      </div>
                    </div>

                    <div className="p-6 md:p-7">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3
                            className="text-2xl font-black text-white"
                            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                          >
                            {activeItem.name}
                          </h3>
                          <div className="mt-1 text-xs text-red-200/60 font-mono">
                            ID: 00{activeItem.id}
                          </div>
                        </div>

                        <button
                          onClick={() => setModalId(null)}
                          className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs text-red-50/80 transition"
                          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                        >
                          {ui.close}
                        </button>
                      </div>

                      <div className="mt-4 text-sm text-gray-200/85">
                        <p style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                          {activeItem.description}
                        </p>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                          <div className="text-gray-400">Origin</div>
                          <div className="mt-1 text-amber-200/80">
                            {activeItem.origin}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                          <div className="text-gray-400">Material</div>
                          <div className="mt-1 text-gray-200/80">
                            {activeItem.material}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div className="text-red-50/90">
                          <div className="text-xs text-red-200/60">Price</div>
                          <div className="mt-1 text-lg font-black">
                            {formatPriceIRR(activeItem.price)}{" "}
                            <span className="text-xs text-red-200/60">
                              {ui.currency}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(activeItem)}
                          disabled={!activeItem.inStock}
                          className={`
                            rounded-2xl px-4 py-3 text-sm border transition
                            ${
                              activeItem.inStock
                                ? "border-red-700/40 bg-red-900/35 hover:bg-red-900/55 text-white"
                                : "border-white/10 bg-white/5 text-gray-500 cursor-not-allowed"
                            }
                          `}
                          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                        >
                          {activeItem.inStock ? ui.addToCart : ui.outOfStock}
                        </button>
                      </div>

                      {cart[activeItem.id] ? (
                        <div className="mt-4 text-xs text-red-200/70">
                          در سبد شما:{" "}
                          <span className="font-mono text-red-100">
                            {cart[activeItem.id]}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-700 to-transparent opacity-60" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}