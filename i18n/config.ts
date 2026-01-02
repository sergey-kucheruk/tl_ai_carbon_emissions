export const locales = ['en', 'de', 'hr', 'it', 'pl', 'sk'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  hr: 'Hrvatski',
  it: 'Italiano',
  pl: 'Polski',
  sk: 'Slovenčina',
};
