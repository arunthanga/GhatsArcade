"use client";

import Link from "next/link";
import { ListingCard } from "@/components/public/ListingCard";
import { useSavedListings } from "@/lib/saved-listings";

export default function SavedListingsPage() {
  const { saved, hydrated } = useSavedListings();

  // Comparison supports 2-3 listings; offer it once the visitor has at least two.
  const compareIds = saved.slice(0, 3).map((listing) => listing.slug);
  const canCompare = saved.length >= 2;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold text-brand-900">Saved listings</h1>
        {canCompare ? (
          <Link
            href={`/compare?ids=${compareIds.join(",")}`}
            className={[
              "rounded-lg bg-brand-700 px-5 py-2 text-sm font-medium text-brand-50",
              "transition-colors hover:bg-brand-800",
            ].join(" ")}
          >
            Compare {compareIds.length} listings
          </Link>
        ) : null}
      </div>

      {!hydrated ? (
        <p className="mt-10 text-brand-600">Loading your saved listings…</p>
      ) : saved.length === 0 ? (
        <p className="mt-10 text-brand-600">
          You haven't saved any listings yet. Tap "Save" on a listing to bookmark it here - no
          login needed.
        </p>
      ) : (
        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </section>
      )}
    </main>
  );
}
