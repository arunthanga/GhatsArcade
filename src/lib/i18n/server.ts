// Server-only locale helpers (importing next/headers keeps this off the client). Reads the
// chosen locale from the NEXT_LOCALE cookie so Server Components render in the right
// language (re-evaluated on router.refresh()).

import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { makeTranslator, type Translator } from "./translate";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getTranslations(): Promise<{ locale: Locale; t: Translator }> {
  const locale = await getLocale();
  return { locale, t: makeTranslator(locale) };
}
