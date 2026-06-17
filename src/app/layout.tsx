import type { Metadata } from "next";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
