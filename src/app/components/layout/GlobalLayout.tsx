"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { GlobalMessages } from "../../../types/messages";

const LOCALES = ["fa", "en"] as const;
type Locale = (typeof LOCALES)[number];

function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split("/")[1];
  return seg === "en" ? "en" : "fa";
}

function stripLocale(pathname: string) {
  const parts = pathname.split("/");
  const maybeLocale = parts[1];
  if (maybeLocale === "fa" || maybeLocale === "en") {
    const rest = "/" + parts.slice(2).join("/");
    return rest === "/" ? "/" : rest;
  }
  return pathname;
}

function withLocale(locale: Locale, path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

function LanguageSwitchMini({
  locale,
  restPath,
}: {
  locale: Locale;
  restPath: string;
}) {
  // ✅ FIX 1: هر دکمه لینک خودش رو دارد (FA -> /fa..., EN -> /en...)
  const hrefFa = withLocale("fa", restPath);
  const hrefEn = withLocale("en", restPath);

  return (
    <div
      className="pointer-events-auto flex items-center rounded-full border border-red-900/40 bg-black/50 backdrop-blur px-1 py-1"
      aria-label="Language switch"
    >
      <Link
        href={hrefFa}
        className={[
          "px-2 py-1 text-[11px] font-black tracking-widest rounded-full transition-colors",
          locale === "fa"
            ? "bg-red-600/25 text-red-100 border border-red-500/30"
            : "text-gray-400 hover:text-gray-200 hover:bg-white/5",
        ].join(" ")}
        prefetch
        aria-current={locale === "fa" ? "page" : undefined}
      >
        FA
      </Link>

      <span className="w-px h-6 bg-red-900/35 mx-1" />

      <Link
        href={hrefEn}
        className={[
          "px-2 py-1 text-[11px] font-black tracking-widest rounded-full transition-colors",
          locale === "en"
            ? "bg-red-600/25 text-red-100 border border-red-500/30"
            : "text-gray-400 hover:text-gray-200 hover:bg-white/5",
        ].join(" ")}
        prefetch
        aria-current={locale === "en" ? "page" : undefined}
      >
        EN
      </Link>
    </div>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <div className="w-10 h-10 rounded-full border border-red-900/40 bg-black/50 backdrop-blur flex items-center justify-center">
      <div className="relative w-4 h-4">
        <span
          className={[
            "absolute left-0 right-0 h-[2px] bg-gray-200 rounded transition-all duration-200",
            open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1",
          ].join(" ")}
        />
        <span
          className={[
            "absolute left-0 right-0 h-[2px] bg-gray-200 rounded transition-all duration-200",
            open ? "opacity-0" : "top-1/2 -translate-y-1/2",
          ].join(" ")}
        />
        <span
          className={[
            "absolute left-0 right-0 h-[2px] bg-gray-200 rounded transition-all duration-200",
            open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-1",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

export default function GlobalLayout({
  children,
  messages,
}: {
  children: React.ReactNode;
  messages: GlobalMessages;
}) {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const restPath = stripLocale(pathname);

  // Home in i18n: /fa or /en
  const isHomePage = restPath === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isRtl = locale === "fa";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // route change => close
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ESC close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // lock body scroll when drawer open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  if (isHomePage) return <>{children}</>;

  const t = messages.GlobalLayout ?? {};

  const brandTitle = t.brand?.title ?? "آکادمی کنجوتسو";
  const brandSubtitle = t.brand?.subtitle ?? "Kenjutsu Academy";

  const navLinks = useMemo(
    () =>
      t.navLinks ?? [
        { name: "وبلاگ", path: "/blog" },
        { name: "عضویت", path: "/join" },
        { name: "اعضای آکادمی", path: "/members" },
        { name: "دوره‌ها", path: "/courses" },
      ],
    [t.navLinks]
  );

  const backHomeText = t.backHome ?? "بازگشت به خانه";

  const footerTitle = t.footer?.title ?? "آکادمی کنجوتسو";
  const footerQuote =
    t.footer?.quote ??
    "مسیر جنگجو تنها تسلط بر شمشیر نیست، بلکه تسلط بر نفس است.";
  const footerCopy =
    t.footer?.copyright ??
    "© 2026 Kenjutsu Academy. All rights reserved.";
  const footerCredit =
    t.footer?.credit ?? "Designed with Honor ⚔️ - Alireza Sarizadeh";

  return (
    <div className="min-h-screen flex flex-col relative bg-[#050505] text-gray-200">
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute top-0 start-0 w-full h-[420px] bg-gradient-to-b from-red-900/10 to-transparent" />
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 start-0 end-0 z-50 border-b transition-all duration-200 ${
          scrolled
            ? "bg-[#0a0a0a]/90 backdrop-blur border-red-900/30 py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Brand */}
          <Link
            href={withLocale(locale, "/")}
            className="flex items-center gap-2"
            aria-label="Home"
          >
            <div className="w-10 h-10 rounded bg-red-900/80 border border-red-700/60 flex items-center justify-center text-white font-bold">
              <span style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>侍</span>
            </div>

            <div className="hidden sm:flex flex-col">
              <span
                className="font-bold text-white leading-none"
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                {brandTitle}
              </span>
              <span className="text-[10px] text-red-500 tracking-widest uppercase">
                {brandSubtitle}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const href = withLocale(locale, link.path);
              const active =
                link.path === "/"
                  ? restPath === "/"
                  : restPath === link.path || restPath.startsWith(`${link.path}/`);

              return (
                <Link
                  key={link.path}
                  href={href}
                  className={`text-sm transition-colors ${
                    active ? "text-red-500" : "text-gray-300 hover:text-gray-100"
                  }`}
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitchMini locale={locale} restPath={restPath} />

            <Link
              href={withLocale(locale, "/")}
              className="hidden lg:flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5"
            >
              <span style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                {backHomeText}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 ltr:rotate-180"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden pointer-events-auto"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Hamburger open={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* ✅ Mobile Side Drawer (FIXED for RTL cut-off) */}
      <div
        className={`md:hidden fixed inset-0 z-[60] ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <button
          type="button"
          className={[
            "absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />

        {/* Panel */}
        <aside
          className={[
            // ✅ FIX 2: از inset-0 استفاده می‌کنیم که تو RTL کات نشه
            "absolute top-0 bottom-0",
            isRtl ? "right-0" : "left-0",
            "w-[85vw] max-w-sm", // ✅ RTL friendly width
            "bg-[#0b0b0b] shadow-2xl",
            "transition-transform duration-200 ease-out",
            "flex flex-col",
            isRtl ? "border-l border-red-900/35" : "border-r border-red-900/35",
            mobileOpen
              ? "translate-x-0"
              : isRtl
              ? "translate-x-full"
              : "-translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          {/* Drawer header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded bg-red-900/80 border border-red-700/60 flex items-center justify-center text-white font-bold">
                <span style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>侍</span>
              </div>
              <div className="flex flex-col">
                <span
                  className="font-bold text-white leading-none"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {brandTitle}
                </span>
                <span className="text-[10px] text-red-500 tracking-widest uppercase">
                  {brandSubtitle}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/5 flex items-center justify-center"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer content */}
          <div className="p-4 flex-1 overflow-y-auto">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const href = withLocale(locale, link.path);
                const active =
                  link.path === "/"
                    ? restPath === "/"
                    : restPath === link.path || restPath.startsWith(`${link.path}/`);

                return (
                  <Link
                    key={link.path}
                    href={href}
                    className={[
                      "rounded-xl px-3 py-2 text-sm border transition-colors",
                      active
                        ? "bg-red-900/25 text-red-100 border-red-800/30"
                        : "text-gray-200 border-white/5 hover:bg-white/5 hover:border-white/10",
                    ].join(" ")}
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-white/10">
              <Link
                href={withLocale(locale, "/")}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-200 border border-white/5 hover:bg-white/5 hover:border-white/10"
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                <span>{backHomeText}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 ltr:rotate-180"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Thin blade line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
          <div className="p-4 text-[11px] text-gray-500 flex items-center justify-between">
            <span className="font-mono">v1</span>
            <span
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-red-200/40"
            >
              印
            </span>
          </div>
        </aside>
      </div>

      {/* Main */}
      <main className="flex-1 relative z-10 w-full pt-24">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#080808] py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-start">
            <h3
              className="text-lg font-bold text-gray-200 mb-2"
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              {footerTitle}
            </h3>
            <p
              className="text-sm text-gray-500 max-w-xs"
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              {footerQuote}
            </p>
          </div>

          <div className="flex gap-4 text-2xl text-red-900/50 select-none font-serif">
            <span>仁</span>
            <span>義</span>
            <span>礼</span>
            <span>勇</span>
          </div>

          <div className="text-xs text-gray-600 flex flex-col items-center md:items-end gap-1">
            <span>{footerCopy}</span>
            <span className="font-mono">{footerCredit}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
