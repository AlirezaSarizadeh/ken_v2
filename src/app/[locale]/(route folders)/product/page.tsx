import type { Metadata } from "next";
import ProductClient from "../../../components/pages/ProductClient";
import type { GlobalMessages } from "@/types/messages";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/types/api";

type Locale = "fa" | "en";

function isLocale(x: string): x is Locale {
  return x === "fa" || x === "en";
}

async function getMessages(locale: Locale): Promise<GlobalMessages> {
  const loaders = {
    fa: () => import("../../../../messages/fa.json"),
    en: () => import("../../../../messages/en.json"),
  };
  const result = await loaders[locale]();
  return result.default as GlobalMessages;
}

type ClientProduct = {
  id?: number;
  name?: string;
  kanji?: string;
  description?: string;
  origin?: string;
  material?: string;
  image?: string;
  category?: string;
  price?: number;
  inStock?: boolean;
  badge?: string;
  gallery?: string[];
};

function toClientProduct(p: Product): ClientProduct {
  return {
    id: p.id ?? undefined,
    name: p.name ?? p.title ?? undefined,
    kanji: p.kanji ?? undefined,
    description: p.description ?? undefined,
    origin: p.origin ?? undefined,
    material: p.material ?? undefined,
    image: p.image ?? p.thumbnail ?? undefined,
    category: p.category ?? p.category_slug ?? undefined,
    price: p.price ?? undefined,
    inStock: p.inStock ?? p.in_stock ?? undefined,
    badge: p.badge ?? undefined,
    gallery: Array.isArray(p.gallery) ? p.gallery.filter((x): x is string => typeof x === "string") : undefined,
  };
}

async function fetchProduct(slug: string, locale: Locale): Promise<ClientProduct | null> {
  const result = await apiFetch<Product>(`/products/${slug}`, locale, { next: { revalidate: 60 } });
  if (!result.data) return null;
  return toClientProduct(result.data);
}

function pickProductFromMessages(messages: GlobalMessages, pid?: number) {
  const items = messages.SectionShop?.items ?? [];
  const safePid = typeof pid === "number" && !Number.isNaN(pid) ? pid : undefined;
  const byId = safePid ? items.find((x) => x?.id === safePid) : undefined;
  return (byId ?? items[0]) ?? null;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ pid?: string; slug?: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";
  const messages = await getMessages(locale);

  const sp = searchParams ? await searchParams : {};
  const slug = sp?.slug;
  const pid = sp?.pid ? Number(sp.pid) : undefined;

  const apiProduct = slug ? await fetchProduct(slug, locale) : null;
  const msgProduct = apiProduct ? null : pickProductFromMessages(messages, pid);
  const name = apiProduct?.name ?? msgProduct?.name;
  const description = apiProduct?.description ?? msgProduct?.description;

  const t = messages.ProductPage?.meta;
  const fallbackTitle = locale === "fa" ? "محصول | فروشگاه" : "Product | Shop";

  return {
    title: name ? `${name} | ${t?.brand ?? "Kenjutsu Academy"}` : (t?.title ?? fallbackTitle),
    description: description ?? t?.description ?? (locale === "fa" ? "جزئیات محصول در فروشگاه ابزار کنجوتسو." : "Product details in the Kenjutsu gear shop."),
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ pid?: string; slug?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";
  const messages = await getMessages(locale);

  const sp = searchParams ? await searchParams : {};
  const slug = sp?.slug;
  const pid = sp?.pid ? Number(sp.pid) : undefined;

  const apiProduct = slug ? await fetchProduct(slug, locale) : null;

  const product = apiProduct ?? pickProductFromMessages(messages, pid);

  return <ProductClient locale={locale} messages={messages} product={product} />;
}