// SEO helpers: absolute URLs, schema.org JSON-LD, and sitemap entries (prj.md Section 3).
// Pure and dependency-light so the shapes are unit-tested in seo.test.ts. Pages stay thin.

import { publicEnv } from "@/lib/env";

const SITE_NAME = "Ghats Arcade";
const SITE_DESCRIPTION =
  "Managed farmland and agricultural land investment opportunities in Kerala and the Kerala-Tamil Nadu border region.";

// Trailing-slash-safe base URL.
function siteUrl(): string {
  return publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${normalized}`;
}

export type ListingJsonLdInput = {
  slug: string;
  title: string;
  description: string;
  priceInr: number;
  sizeAcres: number;
  district: string;
  photos?: { url: string }[];
};

export function listingJsonLd(listing: ListingJsonLdInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    description: listing.description,
    url: absoluteUrl(`/listings/${listing.slug}`),
    image: (listing.photos ?? []).map((photo) => photo.url),
    address: {
      "@type": "PostalAddress",
      addressRegion: listing.district,
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      price: listing.priceInr,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Area",
      value: listing.sizeAcres,
      unitText: "acres",
    },
  };
}

export type ArticleJsonLdInput = {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: Date | string | null;
  authorName?: string;
};

export function articleJsonLd(post: ArticleJsonLdInput): Record<string, unknown> {
  const published =
    post.publishedAt instanceof Date ? post.publishedAt.toISOString() : (post.publishedAt ?? undefined);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: published,
    author: { "@type": "Organization", name: post.authorName ?? SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
  };
}

export type SitemapEntry = { url: string; lastModified?: Date };

const STATIC_PATHS = ["/", "/listings", "/blog", "/about", "/contact"] as const;

export function buildSitemapEntries(
  baseUrl: string,
  dynamic: { listingSlugs?: string[]; blogSlugs?: string[] } = {},
): SitemapEntry[] {
  const base = baseUrl.replace(/\/+$/, "");
  const now = new Date();
  const staticEntries: SitemapEntry[] = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
  }));
  const listingEntries: SitemapEntry[] = (dynamic.listingSlugs ?? []).map((slug) => ({
    url: `${base}/listings/${slug}`,
    lastModified: now,
  }));
  const blogEntries: SitemapEntry[] = (dynamic.blogSlugs ?? []).map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
  }));
  return [...staticEntries, ...listingEntries, ...blogEntries];
}
