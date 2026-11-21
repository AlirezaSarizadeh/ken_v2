import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import CoursesPageClient from "./CoursesPageClient";
import type { GlobalMessages } from "../../../../types/messages";

type Locale = "fa" | "en";
function isLocale(x: string): x is Locale { return x === "fa" || x === "en"; }

async function getMessages(locale: Locale): Promise<GlobalMessages> {
  const result = locale === "en"
    ? await import("../../../../messages/en.json")
    : await import("../../../../messages/fa.json");
  return result.default as GlobalMessages;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";
  return {
    title: locale === "fa" ? "دوره‌ها | آکادمی کن‌جوتسو" : "Courses | Kenjutsu Academy",
    description: locale === "fa"
      ? "دوره‌های آموزشی آکادمی کن‌جوتسو — از مبتدی تا استاد"
      : "Kenjutsu Academy training courses — from beginner to master",
  };
}

export default async function CoursesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";

  const [result, messages] = await Promise.all([
    apiFetch<unknown>("/courses", locale, { next: { revalidate: 60 } }),
    getMessages(locale),
  ]);

  const raw_data = result.data as Record<string, unknown> | null;
  const rawItems = Array.isArray(raw_data?.items) ? (raw_data!.items as any[]) : [];

  const apiCourses = rawItems.map((c: any) => ({
    id: c.id ?? 0,
    title: c.title ?? "",
    kanji: c.japanese_title ?? null,
    description: c.short_description ?? null,
    duration: c.duration_months != null
      ? (locale === "en" ? `${c.duration_months} months` : `${c.duration_months} ماه`)
      : null,
    image: c.image ?? null,
    slug: c.slug ?? null,
  }));

  // The home page defines the academy's two learning levels. Keep the full
  // course page aligned with that editorial content instead of exposing
  // unrelated/incomplete API records when they exist.
  const configuredLevels = (messages.Section4 as any)?.levels;
  const courses = Array.isArray(configuredLevels) && configuredLevels.length >= 2
    ? configuredLevels.slice(0, 2).map((level: any, index: number) => ({
        id: Number(level.id) > 0 ? Number(level.id) : index + 1,
        title: level.title ?? "",
        kanji: level.kanji ?? null,
        description: level.description ?? null,
        duration: level.duration ?? null,
        image: level.image ?? null,
        slug: level.slug ?? null,
      }))
    : apiCourses;

  return <CoursesPageClient courses={courses} locale={locale} />;
}
