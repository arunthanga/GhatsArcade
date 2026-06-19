"use client";

import { useMemo, useState } from "react";

// Tag-filtered photo gallery (prj.md Section 3 — Gallery page). Tags come from the
// ProjectPhoto taxonomy plus an "events" bucket; filtering is client-side over a list the
// server assembles from public projects + events.
export type GalleryItem = {
  id: string;
  url: string;
  alt: string;
  tag: string;
  caption: string;
};

const TAG_LABELS: Record<string, string> = {
  land: "Land",
  road: "Roads",
  water: "Water",
  clubhouse: "Clubhouse",
  plantation: "Plantation",
  landscape: "Landscape",
  aerial: "Aerial",
  seasonal: "Seasonal",
  community: "Community",
  events: "Events",
  general: "General",
};

function tagLabel(tag: string): string {
  return TAG_LABELS[tag] ?? tag;
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const tags = useMemo(() => {
    const present = new Set(items.map((item) => item.tag));
    // Keep a stable, taxonomy-ordered chip list, limited to tags that actually have photos.
    return Object.keys(TAG_LABELS).filter((tag) => present.has(tag));
  }, [items]);

  const [active, setActive] = useState<string>("all");
  const filtered = active === "all" ? items : items.filter((item) => item.tag === active);

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-brand-100 bg-white p-8 text-center text-brand-600">
        Our gallery is being put together. Check back soon, or schedule a visit to see the land in
        person.
      </p>
    );
  }

  const chipClass = (selected: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
      selected
        ? "bg-brand-700 text-brand-50"
        : "border border-brand-200 bg-white text-brand-700 hover:bg-brand-50"
    }`;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photos by tag">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={chipClass(active === "all")}
          aria-pressed={active === "all"}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => setActive(tag)}
            className={chipClass(active === tag)}
            aria-pressed={active === tag}
          >
            {tagLabel(tag)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden rounded-xl bg-brand-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              <span className="truncate">{item.caption}</span>
              <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5">
                {tagLabel(item.tag)}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
