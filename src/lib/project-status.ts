// Pure project-status rules (prj.md Section 3.1 / 8). No DB/env imports so it stays
// easy to reason about and is the single source of truth for public visibility and
// legal status changes. Unknown statuses fail closed.

import { type ProjectStatus, PROJECT_STATUSES } from "@/types";

// Statuses visible to anonymous public visitors. Per prj.md, "Sold Out projects remain
// visible" (proof that plots actually sell), and "Coming Soon" builds anticipation.
// Only `draft` is hidden.
export const PUBLIC_PROJECT_STATUSES: readonly ProjectStatus[] = [
  "published",
  "sold_out",
  "coming_soon",
];

export function isProjectStatus(value: unknown): value is ProjectStatus {
  return typeof value === "string" && (PROJECT_STATUSES as readonly string[]).includes(value);
}

export function isProjectPubliclyVisible(status: unknown): boolean {
  return isProjectStatus(status) && PUBLIC_PROJECT_STATUSES.includes(status);
}

// Allowed status changes. The admin drives these manually; the graph just blocks
// nonsensical jumps and unknown values.
const ALLOWED_TRANSITIONS: Record<ProjectStatus, readonly ProjectStatus[]> = {
  draft: ["published", "coming_soon"],
  coming_soon: ["published", "draft"],
  published: ["sold_out", "coming_soon", "draft"],
  sold_out: ["published"],
};

export function canTransitionProjectStatus(from: unknown, to: unknown): boolean {
  if (!isProjectStatus(from) || !isProjectStatus(to)) {
    return false; // fail closed on unknown values
  }
  if (from === to) {
    return true; // idempotent no-op is allowed
  }
  return ALLOWED_TRANSITIONS[from].includes(to);
}
