"use client";

// Visitor-side "saved listings" (bookmarks). Stored entirely in localStorage so it
// works with no login and no backend. We persist a small snapshot of each listing so
// the /saved page can render without re-fetching from the server.

import { useCallback, useEffect, useState } from "react";

export type SavedListing = {
  slug: string;
  title: string;
  district: string;
  sizeAcres: number;
  priceInr: number;
  status: string;
};

const STORAGE_KEY = "ghats-arcade:saved-listings";
// Fires after we mutate storage so every mounted hook (and other tabs) stay in sync.
const EVENT_NAME = "saved-listings:changed";

// Guard against malformed or stale-shape entries (e.g. from an older version) so the
// UI never tries to render a half-built listing (which would show "₹NaN", etc.).
function isSavedListing(value: unknown): value is SavedListing {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item.slug === "string" &&
    typeof item.title === "string" &&
    typeof item.district === "string" &&
    typeof item.sizeAcres === "number" &&
    typeof item.priceInr === "number" &&
    typeof item.status === "string"
  );
}

function read(): SavedListing[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isSavedListing) : [];
  } catch {
    return [];
  }
}

function write(listings: SavedListing[]): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function useSavedListings() {
  const [saved, setSaved] = useState<SavedListing[]>([]);
  // Avoids a hydration mismatch: render the neutral state until mounted on the client.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSaved(read());
    setHydrated(true);
    const sync = () => setSaved(read());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isSaved = useCallback(
    (slug: string) => saved.some((item) => item.slug === slug),
    [saved],
  );

  const toggle = useCallback((listing: SavedListing) => {
    const current = read();
    const exists = current.some((item) => item.slug === listing.slug);
    write(
      exists
        ? current.filter((item) => item.slug !== listing.slug)
        : [...current, listing],
    );
  }, []);

  const remove = useCallback((slug: string) => {
    write(read().filter((item) => item.slug !== slug));
  }, []);

  return { saved, isSaved, toggle, remove, hydrated };
}
