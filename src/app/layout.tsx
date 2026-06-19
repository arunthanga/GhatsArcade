import type { Metadata } from "next";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getLocale } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "Ghats Arcade - Tranquility meets high-yields",
    template: "%s | Ghats Arcade",
  },
  description:
    "Managed farmland and agricultural land investment opportunities in Kerala and the Kerala-Tamil Nadu border region.",
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
