
"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlobalMessages } from "@/types/messages";
import type { DojoApiData } from "@/types/api";
import Image from "next/image";

type Member = {
  id: number;
  name: string;
  code: string; 
  level: "Beginner" | "Intermediate" | "Advanced" | "Master" | string;
  kanji?: string; 
  bio?: string; 
  tags?: string[];
  avatar?: string; 
};

function isLikelyEnglish(text?: string) {
  return !!text && /[A-Za-z]/.test(text);
}

function normalize(s: string) {
  return (s ?? "").toString().trim().toLowerCase().replace(/\s+/g, " ");
}

const FALLBACK_MEMBERS_FA: Member[] = [
  {
    id: 1,
    name: "علیرضا جابری",
    code: "IR174",
    level: "پیشرفته",
    bio: "تمرکز روی کاتا و ما-آی (فاصله).",
    tags: ["کاتا", "کنجوتسو"],
    avatar:
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "نگار شریفی",
    code: "IR208",
    level: "متوسط",
    bio: "انضباط، ریتم و تمرین دونفره.",
    tags: ["کومیاچی", "ری‌گی"],
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "آرش رضایی",
    code: "IR311",
    level: "مبتدی",
    bio: "ساختن پایه‌ها و فرم‌های صحیح.",
    tags: ["پایه", "کاتا"],
    avatar:
      "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "هومن کیانی",
    code: "IR099",
    level: "استاد",
    bio: "آموزش اصول زمان‌بندی و زاویه.",
    tags: ["تایمینگ", "زاویه"],
    avatar:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=900&q=80",
  },
];

const FALLBACK_MEMBERS_EN: Member[] = [
  {
    id: 1,
    name: "Alireza Jaberi",
    code: "IR174",
    level: "Advanced",
    bio: "Focused on kata and ma-ai (distance).",
    tags: ["Kata", "Kenjutsu"],
    avatar:
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Negar Sharifi",
    code: "IR208",
    level: "Intermediate",
    bio: "Discipline, rhythm, and paired practice.",
    tags: ["Kumitachi", "Reigi"],
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Arash Rezaei",
    code: "IR311",
    level: "Beginner",
    bio: "Building fundamentals and clean forms.",
    tags: ["Basics", "Kata"],
    avatar:
      "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Hooman Kiani",
    code: "IR099",
    level: "Master",
    bio: "Teaching timing and angle principles.",
    tags: ["Timing", "Angles"],
    avatar:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=900&q=80",
  },
];

export default function SectionMembers({
  exiting,
  messages,
  apiData,
}: {
  exiting: boolean;
  messages?: GlobalMessages;
  apiData?: DojoApiData;
}) {
  const t = (messages as any)?.SectionMembers;
  const [isSectionOpen, setIsSectionOpen] = useState(false);

  const inferredIsEn = useMemo(() => {
    return (
      isLikelyEnglish(t?.heading?.title) ||
      isLikelyEnglish(t?.heading?.subtitle) ||
      isLikelyEnglish(t?.ui?.searchPlaceholder)
    );
  }, [t?.heading?.title, t?.heading?.subtitle, t?.ui?.searchPlaceholder]);

  const headingTitle =
    t?.heading?.title ?? (inferredIsEn ? "Members" : "اعضای آکادمی");
  const headingSubtitle =
    t?.heading?.subtitle ??
    (inferredIsEn
      ? "All members, visible in a fast, responsive grid."
      : "همه اعضا؛ نمایش سریع و ریسپانسیو در قالب گرید.");

  const searchPlaceholder =
    t?.ui?.searchPlaceholder ??
    (inferredIsEn ? "Search name, code, level, tags..." : "جستجو: نام، کد، سطح، برچسب‌ها...");
  const levelLabel = t?.ui?.levelLabel ?? (inferredIsEn ? "Level" : "سطح");
  const allLabel = t?.ui?.allLabel ?? (inferredIsEn ? "All" : "همه");

  const floatTop = t?.decor?.floatingKanjiTop ?? "名";
  const floatBottom = t?.decor?.floatingKanjiBottom ?? "簿";
  const bgImage = t?.decor?.bgImage ?? "/sec1_bg.webp";

  const members: Member[] = useMemo(() => {
    const fromApi = apiData?.members?.filter(Boolean).map((m: any) => ({
      id: m.id ?? Math.random(),
      name: m.name ?? "",
      code: m.code ?? "",
      level: m.level ?? m.category ?? "",
      kanji: m.kanji ?? undefined,
      bio: m.bio ?? undefined,
      tags: Array.isArray(m.tags) ? m.tags : undefined,
      avatar: m.avatar ?? m.image ?? undefined,
    }));
    if (fromApi?.length) return fromApi as Member[];
    const fromJson = t?.members?.filter(Boolean);
    if (fromJson?.length) return fromJson;
    return inferredIsEn ? FALLBACK_MEMBERS_EN : FALLBACK_MEMBERS_FA;
  }, [apiData?.members, t?.members, inferredIsEn]);

  const levelOptions = useMemo(() => {
    const fromApi = apiData?.memberCategories?.filter(Boolean).map((c: any) => c.name ?? c.title ?? String(c));
    if (fromApi?.length) return [allLabel, ...fromApi];
    const unique = Array.from(new Set(members.map((m) => m.level).filter(Boolean)));
    return [allLabel, ...unique];
  }, [apiData?.memberCategories, members, allLabel]);

  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState(levelOptions[0] ?? allLabel);

  const filtered = useMemo(() => {
    const q = normalize(query);

    const base = members.filter((m) => {
      const inLevel =
        levelFilter === allLabel
          ? true
          : normalize(m.level) === normalize(levelFilter);

      if (!inLevel) return false;
      if (!q) return true;

      const hay = [
        m.name,
        m.code,
        m.level,
        m.bio ?? "",
        ...(m.tags ?? []),
      ]
        .map((x) => normalize(String(x)))
        .join(" | ");

      return hay.includes(q);
    });

    return base;
  }, [members, query, levelFilter, allLabel]);

  return (
    <div 
      className="w-full min-h-full flex flex-col items-center justify-center relative py-16 md:py-0 overflow-hidden"
      id="members"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10" />
        
        <motion.div
          className="absolute inset-0 bg-cover bg-center fixed"
          style={{ backgroundImage: `url('${bgImage}')`, zIndex: 0 }}
          animate={{ scale: exiting ? 1.2 : 1, opacity: exiting ? 0.8 : 1 }}
          initial={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, #000000 90%) z-5 opacity-80" />

        <motion.div
          className="hidden md:block absolute top-10 left-10 text-red-950/25 text-9xl font-black select-none z-0 filter blur-sm"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          {floatTop}
        </motion.div>

        <motion.div
          className="hidden md:block absolute bottom-5 right-5 text-red-950/25 text-9xl font-black select-none z-0 filter blur-sm"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          {floatBottom}
        </motion.div>
      </div>

      {/* Content Wrapper */}
      <motion.div
        id="main-content-sectionmembers"
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
          {/* Top accent line */}
          <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-800 to-transparent z-30 shadow-[0_0_15px_red]" />

          {/* Header */}
          <div className="relative z-10 p-6 md:p-8 bg-[#0f0f0f] border-b border-white/5">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="relative">
                <h2
                  className="text-2xl md:text-4xl font-black text-red-100/90 tracking-tight"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {headingTitle}
                </h2>
                <p
                  className="mt-2 text-red-500/60 text-sm md:text-base leading-7 max-w-2xl font-light"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {headingSubtitle}
                </p>
              </div>

              {/* Controls */}
              <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="relative">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="
                      w-full bg-black/50
                      border border-red-900/35 rounded-2xl
                      px-4 py-3
                      text-red-50/90 outline-none
                      focus:border-red-600/60 focus:ring-2 focus:ring-red-900/25
                    "
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  />
                </div>

                <div className="relative">
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="
                      w-full bg-black/50
                      border border-red-900/35 rounded-2xl
                      px-4 py-3 pe-12
                      text-red-50/90 outline-none
                      focus:border-red-600/60 focus:ring-2 focus:ring-red-900/25
                      appearance-none
                    "
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  >
                    {levelOptions.map((lvl) => (
                      <option key={lvl} value={lvl} className="bg-black text-white">
                        {levelLabel}: {lvl}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-red-300/60">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-red-100/40">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-600/70 shadow-[0_0_12px_rgba(220,38,38,0.6)]" />
                <span style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                  {inferredIsEn
                    ? `${filtered.length} of ${members.length} visible`
                    : `${filtered.length} از ${members.length} عضو نمایش داده شد`}
                </span>
              </div>
              <div className="hidden md:block" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                {inferredIsEn ? "Scroll the grid to browse." : "برای مشاهده، گرید را اسکرول کنید."}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="relative z-10 px-4 md:px-8 pb-8 pt-4">
            <div
              className="
                rounded-3xl
                border border-red-900/10
                bg-transparent
                overflow-hidden
              "
            >
              <div className="max-h-[62vh] md:max-h-[58vh] overflow-y-auto overflow-x-hidden no-scrollbar p-1">
                <div className="grid gap-3 grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filtered.map((m) => (
                    <MemberCard key={m.id} member={m} />
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="py-16 text-center text-red-100/55">
                    <div className="text-5xl opacity-30">空</div>
                    <div className="mt-3 text-sm" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                      {inferredIsEn
                        ? "No members match your search."
                        : "عضوی با این جستجو پیدا نشد."}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-900 to-transparent z-30 opacity-50" />
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
          aria-controls="main-content-sectionmembers"
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
              alt={isSectionOpen ? "بستن بخش" : "باز کردن بخش"}
              className="w-[420px] md:w-[480px] h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
              style={{ opacity: isSectionOpen ? 0.4 : 1 }}
            />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div
      className="
        group relative overflow-hidden
        border border-black/10
        bg-[#f6f1e7]
        shadow-[0_18px_60px_-40px_rgba(0,0,0,0.9)]
        hover:-translate-y-0.5 hover:shadow-[0_22px_70px_-45px_rgba(0,0,0,1)]
        transition-all duration-300
        flex flex-col
        pb-12
      "
    >
      {/* paper texture */}
      <div className="absolute inset-0 opacity-[0.16] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-1.png')] mix-blend-multiply" />

      {/* subtle Japanese crest (Mon) */}
      <div className="absolute top-4 left-4 opacity-[0.08] pointer-events-none">
        <Image src={'/mon.png'} alt="mon" width={52} height={52} />
      </div>

      {/* tiny top seal */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-5 bg-red-800 shadow-sm" />

      {/* Avatar zone */}
      <div className="relative z-10 px-3 pt-6 flex-shrink-0">
        <div className="relative mx-auto w-[90px] h-[90px] sm:w-[110px] sm:h-[110px]">
          {/* Enso brush ring */}
          <div
            className="absolute inset-0 rounded-full opacity-90"
            style={{
              backgroundImage:
                "url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Enso.svg/512px-Enso.svg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "contrast(1.15)",
            }}
          />
          <div className="absolute inset-[6px] rounded-full bg-black/5 blur-[1px]" />
          {/* avatar */}
          <div className="absolute inset-[14px] sm:inset-[16px] rounded-full overflow-hidden bg-white border border-black/10 shadow-[0_10px_25px_-18px_rgba(0,0,0,0.9)]">
            <img
              src={
                member.avatar ||
                `https://picsum.photos/seed/kenjutsu_${member.id}/500/500.jpg`
              }
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] contrast-[1.08] brightness-[0.98]"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = `https://picsum.photos/seed/member_${member.id}/500/500.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
          </div>
        </div>
      </div>

      {/* Text area */}
      <div className="relative z-10 px-3 pt-3 text-center flex-1 min-w-0">
        <div
          className="text-[13px] sm:text-[14px] font-bold text-black/80 line-clamp-1 leading-tight"
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
        >
          {member.name}
        </div>
        <div
          className="mt-1 text-[10px] sm:text-[11px] text-black/55 line-clamp-1"
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
        >
          {member.level}
        </div>
        {member.bio ? (
          <p
            className="mt-2 text-[10px] sm:text-[11px] leading-5 text-black/50 line-clamp-2"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {member.bio}
          </p>
        ) : null}
      </div>

      {/* Hanko stamp */}
      <div className="absolute bottom-14 right-3 opacity-[0.12] group-hover:opacity-[0.18] transition-opacity duration-300 hidden sm:block">
        <div className="relative w-10 h-10 bg-red-700 rounded-sm shadow-md flex items-center justify-center">
          <span className="text-white text-[12px] font-bold tracking-widest" style={{ writingMode: "vertical-rl", fontFamily: "serif" }}>
            剣道
          </span>
        </div>
      </div>

      {/* Bottom code bar */}
      <div className="absolute left-0 right-0 bottom-0 h-11 border-t border-black/10 bg-red-800 flex items-center justify-center">
        <span className="text-white/80 font-mono text-[10px] sm:text-xs tracking-[0.2em]">
          {member.code}
        </span>
      </div>
    </div>
  );
}
