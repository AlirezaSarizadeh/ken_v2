// components/BlogPostList.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

// اگر مسیر types شما این نیست، فقط همین import رو درست کن
import type { GlobalMessages } from "../../../types/messages";

type Locale = "fa" | "en";

function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split("/")[1];
  return seg === "en" ? "en" : "fa";
}

function stripLocale(pathname: string) {
  const parts = pathname.split("/");
  const maybeLocale = parts[1];
  if (maybeLocale === "fa" || maybeLocale === "en") {
    const rest = "/" + parts.slice(2).join("/");
    return rest === "/" ? "/" : rest;
  }
  return pathname;
}

function withLocale(locale: Locale, path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishDate: string;
  category: string;
  image: string;
  tags: string[];
  readTime: number;
}

type CategoryKey = "all" | "history" | "philosophy" | "martialArts";

interface BlogPostListProps {
  posts: BlogPost[];
  messages?: GlobalMessages; // ✅ optional
}

export function BlogPostList({ posts, messages }: BlogPostListProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const isRtl = locale === "fa";

  const t = (messages as any)?.BlogPostList ?? {};

  // ✅ UI labels (fallback safe)
  const ui = {
    loading: t?.ui?.loading ?? (isRtl ? "در حال بارگذاری..." : "Loading..."),
    readTimeSuffix: t?.ui?.readTimeSuffix ?? (isRtl ? "دقیقه مطالعه" : "min read"),
  };

  // ✅ دسته‌ها با key ثابت (برای فیلتر) + label ترجمه‌شونده
  const categories: Array<{ key: CategoryKey; label: string; matches: string[] }> = useMemo(() => {
    // اگر خواستی از JSON هم قابل تغییر باشد:
    const fromJson = t?.categories as Array<{
      key: CategoryKey;
      label: string;
      matches?: string[];
    }> | undefined;

    const fallback = [
      { key: "all" as const, label: isRtl ? "همه" : "All", matches: ["همه", "All"] },
      { key: "history" as const, label: isRtl ? "تاریخ" : "History", matches: ["تاریخ", "History"] },
      { key: "philosophy" as const, label: isRtl ? "فلسفه" : "Philosophy", matches: ["فلسفه", "Philosophy"] },
      { key: "martialArts" as const, label: isRtl ? "هنرهای رزمی" : "Martial Arts", matches: ["هنرهای رزمی", "Martial Arts"] },
    ];

    if (!fromJson?.length) return fallback;

    // اگر از JSON بیاد ولی matches نداشت، خودمون امنش می‌کنیم
    return fromJson.map((c) => ({
      key: c.key,
      label: c.label,
      matches: c.matches?.length ? c.matches : [c.label],
    }));
  }, [t?.categories, isRtl]);

  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(posts);
  const [loading, setLoading] = useState(false);

  // وقتی locale عوض شد، فیلتر ریست بشه تا گیر نکنه
  useEffect(() => {
    setActiveCategory("all");
  }, [locale]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (activeCategory === "all") {
        setFilteredPosts(posts);
      } else {
        const cat = categories.find((c) => c.key === activeCategory);
        const matches = cat?.matches ?? [];
        setFilteredPosts(posts.filter((p) => matches.includes(p.category)));
      }
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [activeCategory, posts, categories]);

  return (
    <>
      {/* Filter */}
      <div className="px-6 pb-2">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <motion.button
                key={cat.key}
                type="button"
                className={[
                  "px-4 py-2 rounded-lg text-sm transition-all duration-300",
                  active
                    ? "bg-red-900/50 text-white border border-red-700/30"
                    : "bg-black/30 text-gray-300 hover:bg-black/45 border border-white/5",
                ].join(" ")}
                onClick={() => setActiveCategory(cat.key)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                {cat.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500 text-xl" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
              {ui.loading}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => {
              const href = withLocale(locale, `/blog/${post.slug}`);

              return (
                <motion.div
                  key={post.id}
                  className="rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    background: "linear-gradient(to bottom, #1a0505, #2d0808)",
                    border: "1px solid rgba(139, 0, 0, 0.5)",
                  }}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Link href={href} className="block h-full">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/blog${post.id}/400/300.jpg`;
                        }}
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-amber-500" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-400" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                          {post.readTime} {ui.readTimeSuffix}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-red-400 mb-2" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                        {post.title}
                      </h3>

                      <p className="text-sm text-gray-300 mb-4 line-clamp-3" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-600" />
                          <span className="text-xs text-gray-400" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                            {post.author}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                          {post.publishDate}
                        </span>
                      </div>

                      <div className={`mt-3 flex flex-wrap gap-1 ${isRtl ? "" : ""}`}>
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs bg-red-900/30 text-gray-300 px-2 py-1 rounded"
                            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
