import type { MetadataRoute } from "next";
import { absoluteUrl, buildSitemapEntries } from "@/lib/seo";
import { listPublishedPosts } from "@/server/blog";
import { listPublicListings } from "@/server/listings";

// Static routes plus every publicly-visible listing and published blog post. The entry
// shapes are built by the pure buildSitemapEntries helper.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listings, posts] = await Promise.all([listPublicListings(), listPublishedPosts()]);
  return buildSitemapEntries(absoluteUrl("/"), {
    listingSlugs: listings.map((listing) => listing.slug),
    blogSlugs: posts.map((post) => post.slug),
  });
}
