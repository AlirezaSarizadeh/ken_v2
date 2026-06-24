"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Member {
  id: number;
  name: string;
  code: string;
  level: string;
  bio: string | null;
  tags: string[];
  avatar: string | null;
}

interface Category {
  id: number;
  title: string;
  slug: string | null;
}

interface Props {
  members: Member[];
  categories: Category[];
  locale: string;
}

function normalize(s: string) {
  return (s ?? "").toString().trim().toLowerCase().replace(/\s+/g, " ");
}

export default function MembersPageClient({ members, categories, locale }: Props) {
  const isRtl = locale === "fa";

  const headingTitle = isRtl ? "اعضای آکادمی" : "Academy Members";
  const headingSubtitle = isRtl ? "جنگجویان آموزش‌دیده در مسیر کنجوتسو" : "Warriors trained in the path of Kenjutsu";
  const searchPlaceholder = isRtl ? "جستجو: نام، کد، سطح..." : "Search name, code, level...";
  const allLabel = isRtl ? "همه" : "All";
  const levelLabel = isRtl ? "سطح" : "Level";
  const noResults = isRtl ? "عضوی یافت نشد." : "No members found.";

  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState(allLabel);

  const levelOptions = useMemo(() => {
    if (categories.length) return [allLabel, ...categories.map((c) => c.title)];
    const unique = Array.from(new Set(members.map((m) => m.level).filter(Boolean)));
    return [allLabel, ...unique];
  }, [categories, members, allLabel]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return members.filter((m) => {
      const inLevel = levelFilter === allLabel ? true : normalize(m.level) === normalize(levelFilter);
      if (!inLevel) return false;
      if (!q) return true;
      const hay = [m.name, m.code, m.level, m.bio ?? "", ...m.tags].map((x) => normalize(String(x))).join(" | ");
      return hay.includes(q);
    });
  }, [members, query, levelFilter, allLabel]);

  return (
    <div
      className="relative w-full min-h-screen bg-[#050505] py-20 md:py-28 overflow-x-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: "url('/sec1_bg.webp')" }}
        />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-90" />
        <div className="absolute top-10 start-10 text-red-950/20 text-9xl font-black select-none blur-[2px]">名</div>
        <div className="absolute bottom-10 end-10 text-red-950/20 text-9xl font-black select-none blur-[2px]">簿</div>
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 drop-shadow-sm mb-3"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {headingTitle}
          </h1>
          <p
            className="text-gray-400 text-sm md:text-base max-w-lg mx-auto"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {headingSubtitle}
          </p>
          <div className="mt-4 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-red-800 to-transparent" />
        </header>

        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 bg-[#0a0a0a] border border-red-900/30 rounded-xl px-4 py-3 text-gray-200 text-sm focus:outline-none focus:border-red-600 transition-colors"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-red-900/30 rounded-xl px-4 py-3 text-gray-200 text-sm focus:outline-none focus:border-red-600 transition-colors"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            aria-label={levelLabel}
          >
            {levelOptions.map((lvl) => (
              <option key={lvl} value={lvl} className="bg-black text-white">
                {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Members grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            {noResults}
          </div>
        ) : (
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" layout>
            <AnimatePresence mode="popLayout">
              {filtered.map((member, i) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="group flex flex-col items-center bg-[#0a0a0a] border border-red-900/15 rounded-2xl p-4 hover:border-red-800/40 transition-colors duration-300"
                >
                  {/* Avatar */}
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-red-900/30 group-hover:border-red-700/50 transition-colors">
                    <img
                      src={
                        member.avatar ||
                        `https://picsum.photos/seed/member${member.id}/200/200.jpg`
                      }
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/member${member.id}/200/200.jpg`;
                      }}
                    />
                  </div>

                  <h3
                    className="text-sm font-bold text-red-100 text-center line-clamp-1 mb-0.5"
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  >
                    {member.name}
                  </h3>

                  <span className="text-xs text-red-800/70 font-mono mb-1">{member.code}</span>

                  {member.level && (
                    <span
                      className="text-[11px] text-gray-500 border border-red-900/20 px-2 py-0.5 rounded-full"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {member.level}
                    </span>
                  )}

                  {member.bio && (
                    <p
                      className="mt-2 text-[11px] text-gray-600 text-center line-clamp-2 leading-5"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {member.bio}
                    </p>
                  )}

                  {member.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {member.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-red-700/60 bg-red-950/20 px-1.5 py-0.5 rounded"
                          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
