import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  articleJsonLd,
  buildSitemapEntries,
  faqPageJsonLd,
  listingJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "./seo";

// The unit vitest config sets NEXT_PUBLIC_SITE_URL=http://localhost:3000.
const BASE = "http://localhost:3000";

describe("absoluteUrl", () => {
  it("joins the site URL with a path", () => {
    expect(absoluteUrl("/listings")).toBe(`${BASE}/listings`);
    expect(absoluteUrl("listings")).toBe(`${BASE}/listings`);
    expect(absoluteUrl()).toBe(`${BASE}/`);
  });
});

describe("listingJsonLd", () => {
  it("produces a RealEstateListing with INR offer and absolute url", () => {
    const json = listingJsonLd({
      slug: "5-acre-estate",
      title: "5 Acre Estate",
      description: "Nice plot",
      priceInr: 7500000,
      sizeAcres: 5,
      district: "Idukki",
      photos: [{ url: "https://cdn.example.com/a.jpg" }],
    });
    expect(json["@type"]).toBe("RealEstateListing");
    expect(json.url).toBe(`${BASE}/listings/5-acre-estate`);
    expect((json.offers as Record<string, unknown>).priceCurrency).toBe("INR");
    expect((json.offers as Record<string, unknown>).price).toBe(7500000);
    expect(json.image).toEqual(["https://cdn.example.com/a.jpg"]);
  });

  it("defaults images to an empty array", () => {
    const json = listingJsonLd({
      slug: "x",
      title: "x",
      description: "x",
      priceInr: 1,
      sizeAcres: 1,
      district: "Idukki",
    });
    expect(json.image).toEqual([]);
  });
});

describe("articleJsonLd", () => {
  it("produces a BlogPosting with ISO datePublished", () => {
    const date = new Date("2026-01-02T03:04:05.000Z");
    const json = articleJsonLd({ slug: "hello", title: "Hello", publishedAt: date });
    expect(json["@type"]).toBe("BlogPosting");
    expect(json.url).toBe(`${BASE}/blog/hello`);
    expect(json.datePublished).toBe("2026-01-02T03:04:05.000Z");
  });
});

describe("organization/website JSON-LD", () => {
  it("expose the expected types", () => {
    expect(organizationJsonLd()["@type"]).toBe("Organization");
    expect(websiteJsonLd()["@type"]).toBe("WebSite");
  });
});

describe("faqPageJsonLd", () => {
  it("emits a FAQPage with one Question per item", () => {
    const json = faqPageJsonLd([
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ]);
    expect(json["@type"]).toBe("FAQPage");
    const entities = json.mainEntity as { "@type": string; name: string; acceptedAnswer: { text: string } }[];
    expect(entities).toHaveLength(2);
    expect(entities[0]?.name).toBe("Q1?");
    expect(entities[0]?.acceptedAnswer.text).toBe("A1.");
  });
});

describe("buildSitemapEntries", () => {
  it("includes static routes plus dynamic project/listing/blog slugs", () => {
    const entries = buildSitemapEntries(BASE, {
      projectSlugs: ["estate-1"],
      listingSlugs: ["a", "b"],
      blogSlugs: ["post-1"],
      eventSlugs: ["open-day"],
    });
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(`${BASE}/`);
    expect(urls).toContain(`${BASE}/projects`);
    expect(urls).toContain(`${BASE}/projects/estate-1`);
    expect(urls).toContain(`${BASE}/listings`);
    expect(urls).toContain(`${BASE}/listings/a`);
    expect(urls).toContain(`${BASE}/listings/b`);
    expect(urls).toContain(`${BASE}/blog/post-1`);
    expect(urls).toContain(`${BASE}/farmland-real-or-hype`);
    expect(urls).toContain(`${BASE}/farming-guides`);
    expect(urls).toContain(`${BASE}/events`);
    expect(urls).toContain(`${BASE}/events/open-day`);
    expect(urls).toContain(`${BASE}/what-is-managed-farmland`);
    expect(urls).toContain(`${BASE}/why-invest`);
    expect(urls).toContain(`${BASE}/who-should-buy`);
    expect(urls).toContain(`${BASE}/what-managed-means`);
    expect(urls).toContain(`${BASE}/legal-checklist`);
    expect(urls).toContain(`${BASE}/resale`);
    expect(urls).toContain(`${BASE}/horticulture`);
    expect(urls).toContain(`${BASE}/in-and-around`);
    expect(urls).toContain(`${BASE}/gallery`);
    expect(urls).toContain(`${BASE}/faq`);
  });

  it("strips a trailing slash from the base url", () => {
    const entries = buildSitemapEntries(`${BASE}/`);
    expect(entries[0]?.url).toBe(`${BASE}/`);
    expect(entries.some((e) => e.url.includes("//listings"))).toBe(false);
  });

  it("works with no dynamic slugs", () => {
    expect(buildSitemapEntries(BASE)).toHaveLength(20);
  });
});
