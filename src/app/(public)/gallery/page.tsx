import type { Metadata } from "next";
import { GalleryGrid, type GalleryItem } from "@/components/public/GalleryGrid";
import { absoluteUrl } from "@/lib/seo";
import { listPublicEvents } from "@/server/events";
import { listPublicProjects } from "@/server/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from across our managed-farmland projects and community events — land, plantation, water, infrastructure, and the life around them. Filter by what you'd like to see.",
  alternates: { canonical: absoluteUrl("/gallery") },
};

export default async function GalleryPage() {
  const [projects, events] = await Promise.all([listPublicProjects(), listPublicEvents()]);

  const items: GalleryItem[] = [];

  for (const project of projects) {
    if (project.photos.length > 0) {
      for (const photo of project.photos) {
        items.push({
          id: photo.id,
          url: photo.url,
          alt: photo.alt ?? project.title,
          tag: photo.tag ?? "general",
          caption: project.title,
        });
      }
    } else if (project.coverPhotoUrl) {
      items.push({
        id: `${project.id}-cover`,
        url: project.coverPhotoUrl,
        alt: project.title,
        tag: "landscape",
        caption: project.title,
      });
    }
  }

  for (const event of events) {
    for (const photo of event.photos) {
      items.push({
        id: photo.id,
        url: photo.url,
        alt: photo.alt ?? event.title,
        tag: "events",
        caption: event.title,
      });
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-brand-900">Gallery</h1>
        <p className="mt-2 max-w-2xl text-brand-700">
          A look at the land, the plantation, the infrastructure, and the community across our
          projects and events. Use the filters to focus on what matters to you.
        </p>
      </header>

      <GalleryGrid items={items} />
    </main>
  );
}
