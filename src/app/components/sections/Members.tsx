"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { GlobalMessages } from "@/types/messages";
import Image from "next/image";

type Member = {
  id: number;
  name: string;
  code: string; // IR174
  level: "Beginner" | "Intermediate" | "Advanced" | "Master" | string;
  kanji?: string; // optional (unused in card now)
  bio?: string; // short
  tags?: string[];
  avatar?: string; // CDN
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

type SortKey = "newest" | "name" | "code";

export default function SectionMembers({
  exiting,
  messages,
}: {
  exiting: boolean;
  messages?: GlobalMessages;
}) {
  const t = (messages as any)?.SectionMembers;

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
  const sortLabel = t?.ui?.sortLabel ?? (inferredIsEn ? "Sort" : "مرتب‌سازی");
  const sortNewest =
    t?.ui?.sortNewest ?? (inferredIsEn ? "Newest" : "جدیدترین");
  const sortName = t?.ui?.sortName ?? (inferredIsEn ? "Name" : "نام");
  const sortCode = t?.ui?.sortCode ?? (inferredIsEn ? "Code" : "کد");
  const allLabel = t?.ui?.allLabel ?? (inferredIsEn ? "All" : "همه");

  const floatTop = t?.decor?.floatingKanjiTop ?? "名";
  const floatBottom = t?.decor?.floatingKanjiBottom ?? "簿";
  const bgImage = t?.decor?.bgImage ?? "/sec1_bg.webp";

  const members: Member[] = useMemo(() => {
    const fromJson = t?.members?.filter(Boolean);
    if (fromJson?.length) return fromJson;
    return inferredIsEn ? FALLBACK_MEMBERS_EN : FALLBACK_MEMBERS_FA;
  }, [t?.members, inferredIsEn]);

  const levelOptions = useMemo(() => {
    const unique = Array.from(new Set(members.map((m) => m.level).filter(Boolean)));
    return [allLabel, ...unique];
  }, [members, allLabel]);

  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState(levelOptions[0] ?? allLabel);
  const [sortKey, setSortKey] = useState<SortKey>("newest");

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

    const sorted = [...base].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "code") return a.code.localeCompare(b.code);
      return (b.id ?? 0) - (a.id ?? 0);
    });

    return sorted;
  }, [members, query, levelFilter, sortKey, allLabel]);

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-12 md:py-0">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10"></div>

        <motion.div
          className="absolute inset-0 bg-cover bg-center fixed"
          style={{ backgroundImage: `url('${bgImage}')`, zIndex: 0 }}
          animate={{ scale: exiting ? 1.08 : 1, opacity: exiting ? 0.55 : 1 }}
          transition={{ duration: 0.8 }}
        />

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

      {/* Shell */}
      <motion.div
        className="
          relative z-10 
          w-full max-w-6xl 
          bg-[#0a0a0a]
          border-y-2 md:border-2 border-[#3a0a0a]
          rounded-xl md:rounded-3xl 
          shadow-[0_10px_60px_-10px_rgba(0,0,0,1),0_0_20px_rgba(139,0,0,0.3)_inset]
          overflow-hidden
        "
        initial={{ opacity: 0, scale: 0.985, y: 40 }}
        animate={{
          opacity: exiting ? 0 : 1,
          scale: exiting ? 0.95 : 1,
          y: exiting ? 40 : 0,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-800 to-transparent z-30 shadow-[0_0_10px_red]"></div>

        {/* Header */}
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="relative">
              <h2
                className="text-2xl md:text-4xl font-black text-red-50 tracking-tight"
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                {headingTitle}
              </h2>
              <p
                className="mt-2 text-red-100/65 text-sm md:text-base leading-7 max-w-2xl"
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
                    w-full
                    bg-black/60
                    border border-red-900/40
                    rounded-2xl
                    px-4 py-3
                    text-red-50/90
                    placeholder:text-red-200/35
                    outline-none
                    focus:border-red-600/60
                    focus:ring-2 focus:ring-red-900/30
                  "
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                />
              </div>

              <div className="relative">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="
                    w-full
                    bg-black/60
                    border border-red-900/40
                    rounded-2xl
                    px-4 py-3
                    pe-12
                    text-red-50/90
                    outline-none
                    focus:border-red-600/60
                    focus:ring-2 focus:ring-red-900/30
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

                <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-red-200/70">
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

              <div className="relative hidden">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="
                    w-full
                    bg-black/60
                    border border-red-900/40
                    rounded-2xl
                    px-4 py-3
                    text-red-50/90
                    outline-none
                    focus:border-red-600/60
                    focus:ring-2 focus:ring-red-900/30
                  "
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  <option value="newest" className="bg-black text-white">
                    {sortLabel}: {sortNewest}
                  </option>
                  <option value="name" className="bg-black text-white">
                    {sortLabel}: {sortName}
                  </option>
                  <option value="code" className="bg-black text-white">
                    {sortLabel}: {sortCode}
                  </option>
                </select>
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
        <div className="relative z-10 px-4 md:px-8 pb-8">
          <div
            className="
              rounded-3xl
              border border-red-900/30
              bg-black/35
              backdrop-blur-md
              shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]
              overflow-hidden
            "
          >
            <div className="max-h-[62vh] md:max-h-[58vh] overflow-y-auto overflow-x-hidden no-scrollbar p-4 md:p-5">
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="py-16 text-center text-red-100/55">
                  <div className="text-3xl mb-2">⛩️</div>
                  <div style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                    {inferredIsEn
                      ? "No members match your search."
                      : "عضوی با این جستجو پیدا نشد."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-900/80 to-transparent z-30 shadow-[0_0_15px_rgba(139,0,0,0.5)]"></div>
      </motion.div>
    </div>
  );
}

/**
 * ✅ White paper member card (portrait)
 * - No left JP badge
 * - Better avatar area: Enso brush ring + subtle seal
 * - Minimal: name, role line, code
 */
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
      "
      style={{ aspectRatio: "2 / 3" }}
    >
      {/* paper texture */}
      <div className="absolute inset-0 opacity-[0.16] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-1.png')] mix-blend-multiply" />

      {/* 🉐 subtle Japanese crest (Mon) */}
      <div className="absolute top-4 left-4 opacity-[0.08] pointer-events-none">
        <Image src={'/mon.png'} alt="mon" width={'52'} height={'52'} />
      </div>

      {/* tiny top seal */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-5 bg-red-800 shadow-sm" />

      {/* Avatar zone */}
      <div className="relative z-10 px-4 pt-6">
        <div className="relative mx-auto w-[120px] h-[120px]">
          
          {/* Enso brush ring */}
          <div
            className="absolute inset-0 rounded-full opacity-90"
            style={{
              backgroundImage:
                "url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Enso.svg/512px-Enso.svg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "contrast(1.15)",
            }}
          />

          <div className="absolute inset-2 rounded-full bg-black/5 blur-[1px]" />

          {/* avatar */}
          <div className="absolute inset-[18px] rounded-full overflow-hidden bg-white border border-black/10 shadow-[0_10px_25px_-18px_rgba(0,0,0,0.9)]">
            <img
              src={
                member.avatar ??
                `https://picsum.photos/seed/kenjutsu_${member.id}/500/500.jpg`
              }
              alt={member.name}
              className="
                w-full h-full object-cover
                transition-transform duration-500
                group-hover:scale-[1.04]
                contrast-[1.08] brightness-[0.98]
              "
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
      <div className="relative z-10 px-4 pt-4 text-center">
        <div
          className="text-[14px] sm:text-[15px] font-bold text-black/80 line-clamp-1"
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
        >
          {member.name}
        </div>

        <div
          className="mt-1 text-[11px] text-black/55 line-clamp-1"
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
        >
          {member.level}
        </div>

        {member.bio ? (
          <p
            className="mt-3 text-[11px] leading-5 text-black/50 line-clamp-2"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {member.bio}
          </p>
        ) : (
          <div className="mt-3 h-10" />
        )}
      </div>

      {/* 🟥 Japanese Hanko Stamp (inkan style) */}
      <div className="absolute bottom-16 right-5 opacity-[0.15] group-hover:opacity-[0.2] transition-opacity duration-300">
        <div className="relative w-12 h-12 bg-red-700 rounded-sm shadow-md flex items-center justify-center">
          <span
            className="text-white text-[14px] font-bold tracking-widest"
            style={{
              writingMode: "vertical-rl",
              fontFamily: "serif",
            }}
          >
            剣道
          </span>
        </div>
      </div>

      {/* Bottom code bar */}
      <div className="absolute left-0 right-0 bottom-0 h-12 border-t border-black/10 bg-red-800 backdrop-blur-sm flex items-center justify-center">
        <span className="text-white/80 font-mono text-xs tracking-[0.28em]">
          {member.code}
        </span>
      </div>
    </div>
  );
}