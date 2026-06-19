import { HeaderNav, type NavLink } from "@/components/public/HeaderNav";
import { getTranslations } from "@/lib/i18n/server";

export async function SiteHeader() {
  const { t } = await getTranslations();

  const links: NavLink[] = [
    { href: "/", label: t("nav.home") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/listings", label: t("nav.listings") },
    { href: "/events", label: t("nav.events") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <HeaderNav
      brand="Ghats Arcade"
      links={links}
      menuLabels={{ open: t("nav.openMenu"), close: t("nav.closeMenu") }}
    />
  );
}
