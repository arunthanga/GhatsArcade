"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import { makeTranslator, type Translator } from "@/lib/i18n/translate";

type I18nContextValue = { locale: Locale; t: Translator };

const I18nContext = createContext<I18nContextValue | null>(null);

// Receives the server-resolved locale and exposes a translator to Client Components.
// All three dictionaries are bundled (they're small), so no message props need to cross
// the server/client boundary.
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: makeTranslator(locale) }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within a LocaleProvider");
  }
  return ctx;
}
