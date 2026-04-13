import type { Metadata } from "next";
import JoinClient from "../../../components/pages/JoinClient";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";
  const messages = await getMessages(locale);

  const t = messages.JoinPage?.meta;
  const title = t?.title ?? (locale === "fa" ? "عضویت | پیمان‌نامه" : "Join | The Pact");
  const description =
    locale === "fa"
      ? "فرم عضویت هنرجو برای پیوستن به آکادمی کنجوتسو."
      : "Student registration form to join Kenjutsu Academy.";

  return { title, description };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "fa";
  const messages = await getMessages(locale);

  return <JoinClient locale={locale} messages={messages} />;
}