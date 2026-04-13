import {getRequestConfig} from 'next-intl/server';

const locales = ['fa', 'en'] as const;

export type Locale = (typeof locales)[number];
export const routing = {locales, defaultLocale: 'en'} as const;

export default getRequestConfig(async ({locale}) => {
  // Safety fallback
  const safeLocale = routing.locales.includes(locale as any)
    ? (locale as Locale)
    : routing.defaultLocale;

  return {
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}.json`)).default
  };
});
