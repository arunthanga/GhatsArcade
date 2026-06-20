import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Generated from NEXT_PUBLIC_SITE_URL so the Sitemap line never ships a placeholder host.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
