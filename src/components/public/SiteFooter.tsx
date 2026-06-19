import Link from "next/link";
import { LegalDisclaimer } from "@/components/public/LegalDisclaimer";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { publicEnv } from "@/lib/env";
import { getTranslations } from "@/lib/i18n/server";

export async function SiteFooter() {
  const whatsappNumber = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const year = new Date().getFullYear();
  const { t } = await getTranslations();

  return (
    <footer className="mt-16 border-t border-brand-100 bg-brand-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-base font-semibold text-brand-900">Ghats Arcade</p>
            <p className="mt-1 max-w-sm text-sm text-brand-600">{t("footer.tagline")}</p>
          </div>
          <div className="flex flex-wrap gap-8 sm:gap-12">
            <nav aria-label={t("footer.explore")}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-500">
                {t("footer.explore")}
              </p>
              <ul className="flex flex-col gap-2 text-sm text-brand-700">
                <li>
                  <Link href="/projects" className="hover:text-brand-900">
                    {t("nav.projects")}
                  </Link>
                </li>
                <li>
                  <Link href="/listings" className="hover:text-brand-900">
                    {t("nav.listings")}
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-brand-900">
                    {t("nav.events")}
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-brand-900">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-brand-900">
                    {t("nav.about")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-brand-900">
                    {t("nav.contact")}
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label={t("footer.learn")}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-500">
                {t("footer.learn")}
              </p>
              <ul className="flex flex-col gap-2 text-sm text-brand-700">
                <li>
                  <Link href="/blog" className="hover:text-brand-900">
                    The Farmlands Journal
                  </Link>
                </li>
                <li>
                  <Link href="/farmland-real-or-hype" className="hover:text-brand-900">
                    Farmland: Real or Hype?
                  </Link>
                </li>
                <li>
                  <Link href="/farming-guides" className="hover:text-brand-900">
                    Farming Guides
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-brand-900">
                    Free Guides
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-brand-900">
                    FAQ
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label={t("footer.guidance")}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-500">
                {t("footer.guidance")}
              </p>
              <ul className="flex flex-col gap-2 text-sm text-brand-700">
                <li>
                  <Link href="/what-is-managed-farmland" className="hover:text-brand-900">
                    What is Managed Farmland?
                  </Link>
                </li>
                <li>
                  <Link href="/why-invest" className="hover:text-brand-900">
                    Why Invest in Farmland?
                  </Link>
                </li>
                <li>
                  <Link href="/who-should-buy" className="hover:text-brand-900">
                    Who Should Buy?
                  </Link>
                </li>
                <li>
                  <Link href="/what-managed-means" className="hover:text-brand-900">
                    What Managed Means
                  </Link>
                </li>
                <li>
                  <Link href="/legal-checklist" className="hover:text-brand-900">
                    Legal Checklist
                  </Link>
                </li>
                <li>
                  <Link href="/resale" className="hover:text-brand-900">
                    Resale & Exit
                  </Link>
                </li>
                <li>
                  <Link href="/horticulture" className="hover:text-brand-900">
                    Horticulture & Plantation
                  </Link>
                </li>
                <li>
                  <Link href="/in-and-around" className="hover:text-brand-900">
                    In &amp; Around Eruthempathy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {whatsappNumber ? (
            <div>
              <WhatsAppButton phone={whatsappNumber} label={t("common.chatWhatsApp")} />
            </div>
          ) : null}
        </div>

        <div className="mt-8 border-t border-brand-100 pt-6 text-xs text-brand-500">
          <LegalDisclaimer />
          <p className="mt-3">
            (c) {year} Ghats Arcade. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
