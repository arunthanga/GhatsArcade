"use client";

import { type SavedListing, useSavedListings } from "@/lib/saved-listings";

// Bookmark toggle. Pure client-side (localStorage) so it works with no login.
export function SaveListingButton({
  listing,
  className,
}: {
  listing: SavedListing;
  className?: string;
}) {
  const { isSaved, toggle, hydrated } = useSavedListings();
  const saved = hydrated && isSaved(listing.slug);

  return (
    <button
      type="button"
      data-testid="save-listing-button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved listings" : "Save this listing"}
      onClick={(event) => {
        // ListingCard wraps content in a link; don't navigate when toggling.
        event.preventDefault();
        event.stopPropagation();
        toggle(listing);
      }}
      className={
        className ??
        `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
          saved
            ? "border-brand-700 bg-brand-700 text-brand-50"
            : "border-brand-200 bg-white text-brand-700 hover:border-brand-400"
        }`
      }
    >
      <span aria-hidden="true">{saved ? "★" : "☆"}</span>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
