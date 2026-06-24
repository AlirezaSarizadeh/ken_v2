import type { Metadata } from "next";
import type { GlobalMessages } from "../../../../types/messages";

import { BlogPostList } from "../../../components/blog/BlogPostList";
import { getBlogPosts } from "../../../lib/blogApi";

type Locale = "fa" | "en";

function isLocale(x: string): x is Locale {
  return x === "fa" || x === "en";
}

// ✅ Remove explicit type constraint on loaders
async function getMessages(locale: Locale): Promise<GlobalMessages> {
  const loaders = {
    fa: () => import("../../../../messages/fa.json"),
    en: () => import("../../../../messages/en.json"),
  };
  const result = await loaders[locale]();
  return result.default as GlobalMessages;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const isRtl = locale === "fa";

  const messages = await getMessages(locale);
  const t = messages.BlogPage ?? {};

  return {
    title: t.meta?.title || (isRtl ? "خردنامه خانه" : "Dojo Chronicle"),
    description:
      t.meta?.description ||
      (isRtl
        ? "سفری در میان کلمات و حکمت‌های باستانی برای جنگجویان مدرن"
        : "A journey through words and ancient wisdom for modern warriors"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";
  const isRtl = locale === "fa";

  const [posts, messages] = await Promise.all([getBlogPosts(locale), getMessages(locale)]);
  const t = (messages.BlogPage ?? {}) as any;

  const headingTitle = t?.ui?.headingTitle ?? (isRtl ? "خردنامه خانه" : "Dojo Chronicle");
  const headingSubtitle =
    t?.ui?.headingSubtitle ??
    (isRtl
      ? "سفری در میان کلمات و حکمت‌های باستانی برای جنگجویان مدرن"
      : "A journey through words and ancient wisdom for modern warriors");

  const kanjiLarge = t?.ui?.kanjiLarge ?? "知識";

  return (
    <div
      className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center py-20 md:py-28 overflow-x-hidden font-sans"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/blog-bg.jpg')" }}
        />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80" />

        <div className={`absolute top-10 ${isRtl ? "left-5" : "right-5"} text-red-950/20 text-9xl font-black select-none blur-[2px]`}>
          文
        </div>
        <div className={`absolute bottom-20 ${isRtl ? "right-5" : "left-5"} text-red-950/20 text-9xl font-black select-none blur-[2px]`}>
          章
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 w-full max-w-7xl px-4 md:px-6">
        <header className="mb-16 text-center relative">
          <div className="inline-block relative">
            <h1
              className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 drop-shadow-sm mb-4"
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              {headingTitle}
            </h1>

            <span
              className={`absolute -top-8 ${
                isRtl ? "-left-8 md:-left-12" : "-right-8 md:-right-12"
              } text-6xl md:text-8xl text-red-900/10 font-black select-none -z-10`}
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {kanjiLarge}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 mt-2">
            <div className={`h-[1px] w-12 md:w-24 bg-gradient-to-l from-red-800 to-transparent ${!isRtl ? "rotate-180" : ""}`} />
            <p className="text-gray-400 text-sm md:text-base font-light max-w-lg leading-relaxed" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
              {headingSubtitle}
            </p>
            <div className={`h-[1px] w-12 md:w-24 bg-gradient-to-r from-red-800 to-transparent ${!isRtl ? "rotate-180" : ""}`} />
          </div>
        </header>

        <div className="w-full bg-[#0a0a0a]/60 backdrop-blur-xl border border-red-900/20 rounded-3xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-900 to-transparent opacity-70" />
          <div className="p-6 md:p-10 min-h-[500px]">
            <BlogPostList posts={posts} messages={messages} />
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-900 to-transparent opacity-70" />
        </div>
      </main>
    </div>
  );
}