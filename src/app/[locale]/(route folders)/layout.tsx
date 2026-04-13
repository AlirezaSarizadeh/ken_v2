import type { Metadata } from "next";
import type { ReactNode } from "react";
// import { Geist_Mono, Vazirmatn } from "next/font/google";
import localFont from "next/font/local";
import "../../globals.css";

import GlobalLayout from "../../components/layout/GlobalLayout";
import type { GlobalMessages } from "../../../types/messages";

import faRaw from "../../../messages/fa.json";
import enRaw from "../../../messages/en.json";

// const vazirmatn = Vazirmatn({
//   variable: "--font-vazirmatn-sans",
//   subsets: ["latin", "arabic"],
//   display: "swap",
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
const vazirmatn = localFont({
  src: [
    {
      path: "../../Vazir-Medium.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../Vazir-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    {
      path: "../../Vazir-Medium.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../Vazir-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "آکادمی کنجوتسو | مسیر سامورایی",
  description: "آموزش تخصصی هنرهای رزمی ژاپنی و فرهنگ سامورایی",
};

const MESSAGES: Record<"fa" | "en", GlobalMessages> = {
  fa: faRaw as GlobalMessages,
  en: enRaw as GlobalMessages,
};

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = MESSAGES[locale as "fa" | "en"];
  const lang = locale as "fa" | "en";
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir}>
      <body
        className={`${vazirmatn.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {/* ✅ اینجا messages رو پاس می‌دیم تا متن‌ها تغییر کنن */}
        <GlobalLayout messages={messages}>{children}</GlobalLayout>
      </body>
    </html>
  );
}