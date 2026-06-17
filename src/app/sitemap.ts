import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Static routes only for now; listing/blog routes are appended once those
// data sources are implemented (TDD: sitemap.test.ts first).
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/listings", "/blog", "/about", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));
}
