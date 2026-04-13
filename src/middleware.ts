import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fa", "en"] as const;
const defaultLocale = "fa";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore next internals and files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If already has locale, continue
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  // Redirect /anything -> /fa/anything
  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
