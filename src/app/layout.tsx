import type { Metadata } from "next";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getLocale } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "Ghats Arcade — A farmland for your family",
    template: "%s | Ghats Arcade",
  },
  description:
    "Managed farmland for families and co-farmers in Kerala and the Kerala–Tamil Nadu border region — clean titles, trusted developer guidance, organic living, peaceful weekend homes, and long-term land growth.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
