import type { ReactNode } from "react";

import GlobalLayout from "../../components/layout/GlobalLayout";
import type { GlobalMessages } from "../../../types/messages";

import faRaw from "../../../messages/fa.json";
import enRaw from "../../../messages/en.json";

const MESSAGES: Record<"fa" | "en", GlobalMessages> = {
  fa: faRaw as GlobalMessages,
  en: enRaw as GlobalMessages,
};

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}

export default async function InternalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = MESSAGES[(locale as "fa" | "en")] ?? MESSAGES.fa;

  return <GlobalLayout messages={messages}>{children}</GlobalLayout>;
}
