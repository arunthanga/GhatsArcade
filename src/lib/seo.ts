// SEO helpers: metadata, Open Graph, and schema.org JSON-LD (prj.md Section 3).
//
// TDD placeholder: implement behind failing tests in seo.test.ts (RealEstateListing /
// Article JSON-LD shape, canonical URLs, OG tags) before use in pages.

export function listingJsonLd(_listing: unknown): Record<string, unknown> {
  throw new Error("listingJsonLd is not implemented yet - write seo.test.ts first (TDD).");
}

export function articleJsonLd(_post: unknown): Record<string, unknown> {
  throw new Error("articleJsonLd is not implemented yet - write seo.test.ts first (TDD).");
}
