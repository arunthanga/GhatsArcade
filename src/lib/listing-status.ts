// Pure listing-status rules (prj.md Section 8). No DB/env imports so it is fast to
// unit-test and is the single source of truth for what the public can see and which
// status changes are legal. Unknown statuses fail closed.

import { type ListingStatus, LISTING_STATUSES } from "@/types";

// Statuses visible to anonymous public visitors. `draft` (not ready) and `sold`
// (no longer available) are hidden from browse/detail.
export const PUBLIC_LISTING_STATUSES: readonly ListingStatus[] = ["published", "under_offer"];

export function isListingStatus(value: unknown): value is ListingStatus {
  return typeof value === "string" && (LISTING_STATUSES as readonly string[]).includes(value);
}

export function isPubliclyVisible(status: unknown): boolean {
  return isListingStatus(status) && PUBLIC_LISTING_STATUSES.includes(status);
}

// Allowed forward/back transitions. `sold` is terminal.
const ALLOWED_TRANSITIONS: Record<ListingStatus, readonly ListingStatus[]> = {
  draft: ["published"],
  published: ["under_offer", "sold", "draft"],
  under_offer: ["published", "sold"],
  sold: [],
};

export function canTransitionStatus(from: unknown, to: unknown): boolean {
  if (!isListingStatus(from) || !isListingStatus(to)) {
    return false; // fail closed on unknown values
  }
  if (from === to) {
    return true; // idempotent no-op is allowed
  }
  return ALLOWED_TRANSITIONS[from].includes(to);
}
