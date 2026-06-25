// components/blog/BlogPostContent.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ✅ Fixed import path (from src/app/components/blog/ up to src/types/)
import type { GlobalMessages } from "../../../types/messages";
import SafeImg from "@/app/components/ui/SafeImg";

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

// Data interfaces
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML string
  author: string;
  publishDate: string;
  category: string;
  image: string;
  tags: string[];
  readTime: number;
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  image: string;
  publishDate: string;
}

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts: RelatedPost[];
  // ✅ optional for translations
  messages?: GlobalMessages;
}

export function BlogPostContent({ post, relatedPosts, messages }: BlogPostContentProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const isRtl = locale === "fa";

  const t = (messages as any)?.BlogPostContent ?? {};

  const ui = useMemo(() => {
    return {
      opening: t?.ui?.opening ?? (isRtl ? "در حال گشودن طومار..." : "Unrolling the scroll..."),
      backToArchive: t?.ui?.backToArchive ?? (isRtl ? "بازگشت به آرشیو" : "Back to archive"),
      minRead: t?.ui?.minRead ?? (isRtl ? "دقیقه مطالعه" : "min read"),
      relatedTitle: t?.ui?.relatedTitle ?? (isRtl ? "مقالات مرتبط" : "Related posts"),
    };
  }, [t?.ui, isRtl]);

  const [loading, setLoading] = useState(true);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  const blogArchiveHref = withLocale(locale, "/blog");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-900 border-t-red-500 rounded-full animate-spin" />
          <span className="text-red-500 text-sm font-light animate-pulse" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            {ui.opening}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-800 to-red-500 origin-left z-50 shadow-[0_0_10px_red]"
        style={{ scaleX }}
      />

      {/* Header */}
      <div className="p-6 md:p-10 border-b border-red-900/20 bg-black/20">
        {/* Back */}
        <Link
          href={blogArchiveHref}
          className="group inline-flex items-center text-gray-400 hover:text-red-400 mb-8 transition-colors text-sm"
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
        >
          {/* ✅ RTL/LTR arrow */}
          <svg
            className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRtl ? "ml-2" : "mr-2 rotate-180 group-hover:-translate-x-1"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>

          {ui.backToArchive}
        </Link>

        {/* Title */}
        <motion.h1
          className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight drop-shadow-md"
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {post.title}
        </motion.h1>

        {/* Meta */}
        <motion.div
          className="flex flex-wrap items-center gap-4 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
        >
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-red-900 flex items-center justify-center text-red-300 font-bold border border-red-700">
              {post.author?.charAt(0) ?? "A"}
            </span>
            <span className="text-gray-300">{post.author}</span>
          </div>

          <span className="w-1 h-1 bg-gray-600 rounded-full" />

          <span className="text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded text-xs">
            {post.category}
          </span>

          <span className="w-1 h-1 bg-gray-600 rounded-full" />

          <span>
            {post.readTime} {ui.minRead}
          </span>

          <span className="w-1 h-1 bg-gray-600 rounded-full" />
          <span>{post.publishDate}</span>
        </motion.div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-10">
        {/* Image */}
        <motion.div
          className="relative w-full h-64 md:h-[400px] rounded-xl overflow-hidden mb-10 border border-red-900/30 shadow-2xl"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55 }}
        >
          <SafeImg
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
        </motion.div>

        {/* Article */}
        <motion.article
          className={[
            "prose prose-invert prose-lg max-w-none",
            "prose-headings:text-red-100 prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4",
            "prose-p:text-gray-300 prose-p:leading-8 prose-p:mb-4",
            "prose-strong:text-red-400",
            "prose-li:text-gray-300 prose-li:marker:text-red-600",
            // ✅ RTL/LTR safe align
            isRtl ? "prose-p:text-justify prose-ul:pr-5 prose-ol:pr-5" : "prose-p:text-left prose-ul:pl-5 prose-ol:pl-5",
            // ✅ blockquote direction safe
            isRtl
              ? "prose-blockquote:border-r-4 prose-blockquote:border-red-600 prose-blockquote:bg-red-900/10 prose-blockquote:p-4 prose-blockquote:rounded-l prose-blockquote:italic"
              : "prose-blockquote:border-l-4 prose-blockquote:border-red-600 prose-blockquote:bg-red-900/10 prose-blockquote:p-4 prose-blockquote:rounded-r prose-blockquote:italic",
          ].join(" ")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.55 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ fontFamily: "'Vazirmatn', sans-serif" }}
        />

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-white/5 hover:bg-red-900/40 text-gray-400 hover:text-red-300 px-3 py-1.5 rounded transition-colors cursor-pointer border border-white/5"
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Related */}
      {relatedPosts.length > 0 && (
        <div className="bg-black/30 border-t border-red-900/30 p-6 md:p-10">
          <h2 className="text-2xl font-bold text-red-500 mb-8 flex items-center gap-3" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            <span className="w-2 h-8 bg-red-600 rounded-full" />
            {ui.relatedTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((rp, idx) => {
              const href = withLocale(locale, `/blog/${rp.slug}`);

              return (
                <Link href={href} key={rp.id} className="block">
                  <motion.div
                    className="group relative h-full bg-[#0f0f0f] border border-white/5 rounded-lg overflow-hidden hover:border-red-900/50 transition-all duration-300"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="h-40 overflow-hidden relative">
                      <SafeImg
                        src={rp.image}
                        alt={rp.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter brightness-75 group-hover:brightness-100"
                      />
                    </div>

                    <div className="p-4">
                      <h3
                        className="text-lg font-bold text-gray-200 group-hover:text-red-400 transition-colors mb-2 line-clamp-2"
                        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                      >
                        {rp.title}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-gray-500 mt-4" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{rp.publishDate}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}