import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "../../../../../lib/api";

type Locale = "fa" | "en";
type AboutSection = {
  id: number | string;
  title: string;
  kanji?: string | null;
  content: string;
  image?: string | null;
};

function isLocale(value: string): value is Locale {
  return value === "fa" || value === "en";
}

async function getMessages(locale: Locale) {
  const result = locale === "en"
    ? await import("../../../../../messages/en.json")
    : await import("../../../../../messages/fa.json");
  return result.default as any;
}

async function getSections(locale: Locale): Promise<AboutSection[]> {
  const [result, messages] = await Promise.all([
    apiFetch<any>("/about", locale, { next: { revalidate: 60 } }),
    getMessages(locale),
  ]);
  const apiSections = Array.isArray(result.data?.sections) ? result.data.sections : [];
  if (apiSections.length) {
    return apiSections.map((section: any) => ({
      id: section.id,
      title: section.title ?? "",
      kanji: section.japanese_title ?? null,
      content: section.content ?? section.description ?? section.short_description ?? "",
      image: section.image ?? null,
    }));
  }
  return ((messages.Section2?.tabs ?? []) as any[]).map((section, index) => ({
    id: section.id ?? index,
    title: section.title ?? "",
    kanji: section.kanji ?? null,
    content: section.content ?? "",
    image: section.image ?? null,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const section = (await getSections(locale)).find((item) => String(item.id) === id);
  return section ? { title: `${section.title} | ${locale === "fa" ? "درباره ما" : "About us"}` } : {};
}

export default async function AboutSectionPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const isRtl = locale === "fa";
  const sections = await getSections(locale);
  const section = sections.find((item) => String(item.id) === id);
  if (!section) notFound();

  return (
    <div className="relative min-h-screen bg-[#050505] py-20 md:py-28" dir={isRtl ? "rtl" : "ltr"}>
      <div className="fixed inset-0 pointer-events-none bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/about_bg.webp')" }} />
      <main className="relative z-10 mx-auto w-full max-w-4xl px-4">
        <Link href={`/${locale}`} className="mb-8 inline-flex items-center gap-2 rounded-lg border border-red-900/50 bg-black/60 px-4 py-2 text-sm text-red-300 hover:bg-red-950/50">
          {isRtl ? "بازگشت به صفحه اصلی" : "Back to home"}
        </Link>
        <article className="overflow-hidden rounded-3xl border border-red-900/30 bg-[#0a0a0a]/90 shadow-[0_0_70px_-20px_rgba(0,0,0,0.9)]">
          {section.image ? <img src={section.image} alt={section.title} className="h-64 w-full object-cover opacity-80" /> : null}
          <div className="p-7 md:p-12">
            <div className="mb-6 flex items-center gap-4">
              {section.kanji ? <span className="text-5xl text-red-900/50">{section.kanji}</span> : null}
              <h1 className="text-3xl font-bold leading-relaxed text-red-100 md:text-5xl">{section.title}</h1>
            </div>
            <p className="whitespace-pre-line text-base leading-loose text-gray-300 md:text-lg">{section.content}</p>
          </div>
        </article>
      </main>
    </div>
  );
}
