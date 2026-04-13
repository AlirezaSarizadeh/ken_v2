import type { Metadata } from "next";
import ProductClient from "../../../components/pages/ProductClient";
import type { GlobalMessages } from "@/types/messages";

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

function pickProductFromMessages(messages: GlobalMessages, pid?: number) {
  const items = messages.SectionShop?.items ?? [];
  const safePid = typeof pid === "number" && !Number.isNaN(pid) ? pid : undefined;

  const byId = safePid ? items.find((x) => x?.id === safePid) : undefined;
  const first = items[0];

  return (byId ?? first) ?? null;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ pid?: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";
  const messages = await getMessages(locale);

  const sp = searchParams ? await searchParams : {};
  const pid = sp?.pid ? Number(sp.pid) : undefined;

  const product = pickProductFromMessages(messages, pid);

  const t = messages.ProductPage?.meta;
  const fallbackTitle = locale === "fa" ? "محصول | فروشگاه" : "Product | Shop";
  const title = product?.name ? `${product.name} | ${t?.brand ?? "Kenjutsu Academy"}` : (t?.title ?? fallbackTitle);

  const description =
    product?.description ??
    t?.description ??
    (locale === "fa"
      ? "جزئیات محصول در فروشگاه ابزار کنجوتسو."
      : "Product details in the Kenjutsu gear shop.");

  return { title, description };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ pid?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";
  const messages = await getMessages(locale);

  const sp = searchParams ? await searchParams : {};
  const pid = sp?.pid ? Number(sp.pid) : undefined;

  const product = pickProductFromMessages(messages, pid);

  return <ProductClient locale={locale} messages={messages} product={product} />;
}