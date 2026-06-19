// Dot-path translator shared by Server Components (via getTranslations) and Client
// Components (via the LocaleProvider). Falls back to English, then to the provided
// fallback, then to the key itself — so a missing translation never blanks the UI.

import type { Locale } from "./config";
import en from "./messages/en";
import ml from "./messages/ml";
import ta from "./messages/ta";

const DICTS: Record<Locale, unknown> = { en, ta, ml };

function lookup(source: unknown, path: string[]): unknown {
  let current: unknown = source;
  for (const key of path) {
    if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

export type Translator = (key: string, fallback?: string) => string;

export function makeTranslator(locale: Locale): Translator {
  const dict = DICTS[locale];
  return (key, fallback) => {
    const path = key.split(".");
    const localized = lookup(dict, path);
    if (typeof localized === "string") {
      return localized;
    }
    const english = lookup(en, path);
    if (typeof english === "string") {
      return english;
    }
    return fallback ?? key;
  };
}
