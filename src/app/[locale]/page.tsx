import { notFound } from "next/navigation";
import DojoPageClient from "../components/pages/DojoPageClient";
import type { GlobalMessages } from "../../types/messages";

const LOCALES = ["fa", "en"] as const;
type Locale = (typeof LOCALES)[number];

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}

async function getMessages(locale: Locale): Promise<GlobalMessages> {
  const loaders = {
    fa: () => import("../../messages/fa.json"),
    en: () => import("../../messages/en.json"),
  };
  const result = await loaders[locale]();
  return result.default as GlobalMessages;
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale as Locale)) notFound();

  const messages = await getMessages(locale as Locale);

  return <DojoPageClient messages={messages} />;
}