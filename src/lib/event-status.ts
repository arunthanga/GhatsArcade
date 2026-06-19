// Pure event-status rules (prj.md Section 3). Both `upcoming` and `past` events are public
// (past events double as a social-proof gallery); only unknown statuses are hidden.

import { EVENT_STATUSES, type EventStatus } from "@/types";

export const PUBLIC_EVENT_STATUSES = ["upcoming", "past"] as const;

export function isEventStatus(value: unknown): value is EventStatus {
  return typeof value === "string" && (EVENT_STATUSES as readonly string[]).includes(value);
}

export function isEventPubliclyVisible(status: unknown): boolean {
  return isEventStatus(status);
}
