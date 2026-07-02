"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { LOCALE_COOKIE, LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n/config";

const ONE_YEAR = 60 * 60 * 24 * 365;

// Writes the NEXT_LOCALE cookie and refreshes so Server Components re-render in the new
// language. A native <select> keeps it compact and works well on touch devices.
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onChange(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <label className={`inline-flex items-center gap-1 ${className}`}>
      <span className="sr-only">{t("nav.language")}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 text-current opacity-70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
      </svg>
      <select
        aria-label={t("nav.language")}
        value={locale}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as Locale)}
        className="cursor-pointer rounded-md border border-current/20 bg-transparent py-1 pl-1 pr-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-current/30 disabled:opacity-60"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} className="text-brand-900">
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
