// Locale configuration for the cookie-based multilingual setup (prj.md Section 3).
// English is the default; Tamil and Malayalam can be switched via the header. The chosen
// locale is persisted in the NEXT_LOCALE cookie and read server-side so Server Components
// render in the right language after `router.refresh()`.

export const LOCALES = ["en", "ta", "ml"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Persisted across the site; 1-year max-age set by the LanguageSwitcher.
export const LOCALE_COOKIE = "NEXT_LOCALE";

// Native-script labels for the switcher.
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ta: "தமிழ்",
  ml: "മലയാളം",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
