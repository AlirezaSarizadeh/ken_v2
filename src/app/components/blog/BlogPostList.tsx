// components/BlogPostList.tsx
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { GlobalMessages } from "../../../types/messages";
import SafeImg from "@/app/components/ui/SafeImg";

type Locale = "fa" | "en";

function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split("/")[1];
  return seg === "en" ? "en" : "fa";
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
  categorySlug: string;
  image: string;
  tags: string[];
  readTime: number;
}

interface ApiCategory {
  id?: number;
  title?: string | null;
  slug?: string | null;
  name?: string | null;
}

interface BlogPostListProps {
  posts: BlogPost[];
  categories?: ApiCategory[];
  messages?: GlobalMessages;
}

export function BlogPostList({ posts, categories, messages }: BlogPostListProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const isRtl = locale === "fa";

  const t = (messages as any)?.BlogPostList ?? {};

  const ui = {
    readTimeSuffix: t?.ui?.readTimeSuffix ?? (isRtl ? "دقیقه مطالعه" : "min read"),
    allLabel: isRtl ? "همه" : "All",
    noResults: isRtl ? "مطلبی یافت نشد." : "No posts found.",
  };

  // Build tabs: "all" + API categories; fall back to titles derived from posts
  const tabs = useMemo<Array<{ slug: string; label: string }>>(() => {
    const allTab = { slug: "all", label: ui.allLabel };

    if (categories?.length) {
      return [
        allTab,
        ...categories
          .filter((c) => c.slug || c.title)
          .map((c) => ({ slug: c.slug ?? c.title ?? "", label: c.title ?? c.slug ?? "" })),
      ];
    }

    // Fallback: derive unique category titles from posts
    const seen = new Set<string>();
    const derived: Array<{ slug: string; label: string }> = [];
    for (const p of posts) {
      const key = p.categorySlug || p.category;
      if (key && !seen.has(key)) {
        seen.add(key);
        derived.push({ slug: key, label: p.category || key });
      }
    }
    return derived.length ? [allTab, ...derived] : [allTab];
  }, [categories, posts, ui.allLabel]);

  const [activeSlug, setActiveSlug] = useState("all");

  // Synchronous filter — no fake loading delay
  const filteredPosts = useMemo(() => {
    if (activeSlug === "all") return posts;
    return posts.filter(
      (p) =>
        p.categorySlug === activeSlug ||
        p.category === activeSlug ||
        (p.categorySlug || "").toLowerCase() === activeSlug.toLowerCase() ||
        (p.category || "").toLowerCase() === activeSlug.toLowerCase()
    );
  }, [activeSlug, posts]);

  return (
    <>
      {/* Filter tabs — horizontal scroll, no wrap */}
      <div className="px-1 pb-2">
        <div
          className="flex flex-nowrap overflow-x-auto gap-2 mb-6 pb-1 scrollbar-none justify-start md:justify-center"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((tab) => {
            const active = activeSlug === tab.slug;
            return (
              <motion.button
                key={tab.slug}
                type="button"
                className={[
                  "relative flex-shrink-0 px-4 py-2 rounded-full text-sm transition-colors duration-300",
                  active ? "text-white" : "text-gray-500 hover:text-gray-300",
                ].join(" ")}
                onClick={() => setActiveSlug(tab.slug)}
                whileTap={{ scale: 0.97 }}
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                {active && (
                  <motion.div
                    layoutId="activeBlogFilter"
                    className="absolute inset-0 bg-red-900/40 border border-red-700/50 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-6 overflow-auto">
        {filteredPosts.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            {ui.noResults}
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
                      <SafeImg
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
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

                      <div className="mt-3 flex flex-wrap gap-1">
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
