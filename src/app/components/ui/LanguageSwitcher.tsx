"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Locale = "fa" | "en";

function parsePath(pathname: string) {
  const parts = pathname.split("/");
  const maybe = parts[1] as Locale | string;
  const locale: Locale = maybe === "en" ? "en" : "fa";
  const rest = maybe === "fa" || maybe === "en" ? "/" + parts.slice(2).join("/") : pathname;
  return { locale, rest: rest === "/" ? "" : rest };
}

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const { locale, rest } = parsePath(pathname);

  const btnBase =
    "rounded-full px-3 py-1.5 text-xs font-black tracking-widest transition-all duration-300";
  const activeBtn =
    "bg-red-600/20 text-white ring-1 ring-red-500/40 shadow-[0_0_18px_rgba(220,38,38,0.28)]";
  const idleBtn = "text-gray-300 hover:text-white hover:bg-white/5";

  return (
    <div
      className={[
        "pointer-events-auto inline-flex items-center",
        "rounded-full border border-red-900/50 bg-black/60 backdrop-blur-xl",
        "shadow-[0_0_24px_rgba(220,38,38,0.16)]",
        compact ? "p-1" : "p-1.5",
      ].join(" ")}
      aria-label="Language switcher"
    >
      <Link
        href={`/fa${rest}`}
        className={[btnBase, locale === "fa" ? activeBtn : idleBtn, compact ? "px-2 py-1" : ""].join(
          " "
        )}
        prefetch
        aria-current={locale === "fa" ? "page" : undefined}
        title="فارسی"
      >
        FA
      </Link>

      <span className="mx-1 h-5 w-px bg-red-900/50" />

      <Link
        href={`/en${rest}`}
        className={[btnBase, locale === "en" ? activeBtn : idleBtn, compact ? "px-2 py-1" : ""].join(
          " "
        )}
        prefetch
        aria-current={locale === "en" ? "page" : undefined}
        title="English"
      >
        EN
      </Link>
    </div>
  );
}
