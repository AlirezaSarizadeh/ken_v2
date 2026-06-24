import type { Metadata } from "next";
import { apiFetch } from "@/lib/api";
import MembersPageClient from "./MembersPageClient";

type Locale = "fa" | "en";
function isLocale(x: string): x is Locale { return x === "fa" || x === "en"; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";
  return {
    title: locale === "fa" ? "اعضای آکادمی | کنجوتسو" : "Academy Members | Kenjutsu",
    description: locale === "fa"
      ? "آشنایی با اعضا و هنرجویان آکادمی کنجوتسو"
      : "Meet the members and students of Kenjutsu Academy",
  };
}

function extractItems(raw: unknown): any[] {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  if (Array.isArray(obj.items)) return obj.items;
  return [];
}

export default async function MembersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";

  const [membersRes, catsRes] = await Promise.allSettled([
    apiFetch<unknown>("/members", locale, { next: { revalidate: 60 } }),
    apiFetch<unknown>("/member-categories", locale, { next: { revalidate: 3600 } }),
  ]);

  const rawMembers = membersRes.status === "fulfilled" ? extractItems(membersRes.value.data) : [];
  const rawCats = catsRes.status === "fulfilled" ? extractItems(catsRes.value.data) : [];

  const members = rawMembers.map((m: any) => ({
    id: m.id ?? 0,
    name: m.name ?? "",
    code: m.member_code ?? "",
    level: m.category?.title ?? "",
    bio: m.short_description ?? null,
    tags: m.tag ? [m.tag] : [],
    avatar: m.image ?? null,
  }));

  const categories = rawCats.map((c: any) => ({
    id: c.id ?? 0,
    title: c.title ?? "",
    slug: c.slug ?? null,
  }));

  return <MembersPageClient members={members} categories={categories} locale={locale} />;
}
