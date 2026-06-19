import type { MetadataRoute } from "next";
import { absoluteUrl, buildSitemapEntries } from "@/lib/seo";
import { listPublishedPosts } from "@/server/blog";
import { listPublicEvents } from "@/server/events";
import { listPublicListings } from "@/server/listings";
import { listPublicProjects } from "@/server/projects";

// Static routes plus every publicly-visible project, listing, published blog post, and event.
// The entry shapes are built by the pure buildSitemapEntries helper.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, listings, posts, events] = await Promise.all([
    listPublicProjects(),
    listPublicListings(),
    listPublishedPosts(),
    listPublicEvents(),
  ]);
  return buildSitemapEntries(absoluteUrl("/"), {
    projectSlugs: projects.map((project) => project.slug),
    listingSlugs: listings.map((listing) => listing.slug),
    blogSlugs: posts.map((post) => post.slug),
    eventSlugs: events.map((event) => event.slug),
  });
}
