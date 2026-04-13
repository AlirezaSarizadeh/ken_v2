import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostContent } from "../../../../components/blog/BlogPostContent";
import { getBlogPostBySlug, getRelatedBlogPosts } from "../../../../lib/blogApi";

import type { GlobalMessages } from "../../../../../types/messages";

type Locale = "fa" | "en";

function isLocale(x: string): x is Locale {
  return x === "fa" || x === "en";
}

// ✅ Remove explicit type constraint on loaders
async function getMessages(locale: Locale): Promise<GlobalMessages> {
  const loaders = {
    fa: () => import("../../../../../messages/fa.json"),
    en: () => import("../../../../../messages/en.json"),
  };
  const result = await loaders[locale]();
  return result.default as GlobalMessages;
}

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";

  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  const messages = await getMessages(locale);
  
  // ✅ Fixed: Use only siteTitle from meta
  const baseSiteTitle = messages.BlogPostPage?.meta?.siteTitle ?? (locale === "fa" ? "خردنامه خانه" : "Dojo Chronicle");

  return {
    title: `${post.title} | ${baseSiteTitle}`,
    description: post.excerpt || (locale === "fa" ? "خوانندگی مقالات" : "Read articles"),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const isRtl = locale === "fa";

  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const [relatedPosts, messages] = await Promise.all([
    getRelatedBlogPosts(post.id, post.category),
    getMessages(locale),
  ]);

  return (
    <div
      className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center py-20 md:py-28 overflow-x-hidden font-sans"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
          style={{ backgroundImage: "url('/blog-bg.jpg')" }}
        />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80" />

        {/* Decorative Kanji (RTL/LTR safe) */}
        <div className={`absolute top-10 ${isRtl ? "left-5" : "right-5"} text-red-950/20 text-9xl font-black select-none blur-[2px]`}>
          文
        </div>

        <div className={`absolute bottom-20 ${isRtl ? "right-5" : "left-5"} text-red-950/20 text-9xl font-black select-none blur-[2px]`}>
          章
        </div>
      </div>

      <main className="relative z-10 w-full max-w-4xl px-0 md:px-4">
        <div className="w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-x-0 md:border-x border-red-900/20 shadow-[0_0_100px_-20px_rgba(0,0,0,1)] min-h-[80vh] flex flex-col">
          <div className="flex-1 p-0">
            <BlogPostContent
              post={post}
              relatedPosts={relatedPosts}
              // @ts-expect-error optional props if you add them later
              locale={locale}
              messages={messages}
            />
          </div>
        </div>
      </main>
    </div>
  );
}