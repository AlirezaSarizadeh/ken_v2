import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import CoursesPageClient from "./CoursesPageClient";

type Locale = "fa" | "en";
function isLocale(x: string): x is Locale { return x === "fa" || x === "en"; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";
  return {
    title: locale === "fa" ? "دوره‌ها | آکادمی کنجوتسو" : "Courses | Kenjutsu Academy",
    description: locale === "fa"
      ? "دوره‌های آموزشی آکادمی کنجوتسو — از مبتدی تا استاد"
      : "Kenjutsu Academy training courses — from beginner to master",
  };
}

export default async function CoursesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";

  const result = await apiFetch<unknown>("/courses", locale, { next: { revalidate: 60 } });

  const raw_data = result.data as Record<string, unknown> | null;
  const rawItems = Array.isArray(raw_data?.items) ? (raw_data!.items as any[]) : [];

  const courses = rawItems.map((c: any) => ({
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

  return <CoursesPageClient courses={courses} locale={locale} />;
}
