"use client";

import { usePathname } from "next/navigation";
import { FloatingWhatsAppButton } from "@/components/public/FloatingWhatsAppButton";

// Decides the floating WhatsApp button's behaviour by route (prj.md Section 3.1, Block 9 +
// "context-aware floating button"): on the home page it appears once the visitor scrolls past
// the early trust-building blocks; on project-detail and education/region pages it is always on;
// elsewhere (nav/list pages, contact) it stays hidden so it doesn't compete with on-page forms.
const ALWAYS_ON_PREFIXES = [
  "/what-is-managed-farmland",
  "/why-invest",
  "/who-should-buy",
  "/what-managed-means",
  "/legal-checklist",
  "/resale",
  "/horticulture",
  "/in-and-around",
  "/faq",
  "/farmland-real-or-hype",
  "/farming-guides",
];

export function PublicWhatsAppFloat({ phone }: { phone: string }) {
  const pathname = usePathname();
  const message = "I'm interested in a Ghats Arcade project.";

  if (pathname === "/") {
    return <FloatingWhatsAppButton phone={phone} message={message} showAfter={700} />;
  }

  // Project detail pages (but not the /projects nav list) and the education/region pages.
  const isProjectDetail = pathname.startsWith("/projects/");
  const isAlwaysOn = isProjectDetail || ALWAYS_ON_PREFIXES.some((p) => pathname.startsWith(p));

  if (isAlwaysOn) {
    return <FloatingWhatsAppButton phone={phone} message={message} showAfter={0} />;
  }

  return null;
}
