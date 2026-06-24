import type { Metadata } from "next";
// import { Geist_Mono, Vazirmatn } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../globals.css";
import { AuthProvider } from "@/app/context/AuthContext";

const locales = ["fa", "en"] as const;
type Locale = (typeof locales)[number];

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
      path: "../Vazir-Medium.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../Vazir-Bold.woff2",
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
      path: "../Vazir-Medium.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../Vazir-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});


function getDir(locale: Locale) {
  return locale === "fa" ? "rtl" : "ltr";
}

function getLang(locale: Locale) {
  return locale === "fa" ? "fa" : "en";
}

async function getMessages(locale: Locale) {
  return (await import(`../../messages/${locale}.json`)).default as {
    Metadata?: { title?: string; description?: string };
  };
}

// ✅ متادیتا بر اساس زبان (از JSON)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages(locale as Locale);

  const title = messages?.Metadata?.title ?? "Website";
  const description = messages?.Metadata?.description ?? "";

  return {
    title,
    description,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const safeLocale = locale as Locale;

  return (
    <html lang={getLang(safeLocale)} dir={getDir(safeLocale)}>
      <body
        className={`${vazirmatn.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
