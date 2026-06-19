// Pure blog status/publish rules (prj.md Section 3/8). No DB/env imports so they are
// fast to unit-test and are the single source of truth for public visibility and the
// publishedAt lifecycle. Unknown statuses fail closed.

import { type BlogStatus, BLOG_STATUSES } from "@/types";

export function isBlogStatus(value: unknown): value is BlogStatus {
  return typeof value === "string" && (BLOG_STATUSES as readonly string[]).includes(value);
}

export function isBlogPubliclyVisible(status: unknown): boolean {
  return status === "published";
}

// Decide publishedAt when a post's status changes:
// - first time it becomes published -> stamp `now`
// - already published and stays published -> keep the original timestamp
// - reverts to draft -> clear it
// Fail-closed: an unknown next status yields null.
export function resolvePublishedAt(
  _prevStatus: unknown,
  nextStatus: unknown,
  prevPublishedAt: Date | null,
  now: Date,
): Date | null {
  if (!isBlogStatus(nextStatus) || nextStatus !== "published") {
    return null;
  }
  return prevPublishedAt ?? now;
}
