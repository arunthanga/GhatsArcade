// Pure lead-status pipeline rules (prj.md Section 3/8). No DB/env imports so it is
// fast to unit-test and is the single source of truth for legal status changes.
// Unknown statuses fail closed.

import { type LeadStatus, LEAD_STATUSES } from "@/types";

// converted/lost are terminal: once a lead is closed it cannot reopen.
const TERMINAL_LEAD_STATUSES: readonly LeadStatus[] = ["converted", "lost"];

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && (LEAD_STATUSES as readonly string[]).includes(value);
}

export function isTerminalLeadStatus(status: unknown): boolean {
  return isLeadStatus(status) && TERMINAL_LEAD_STATUSES.includes(status);
}

// Forward pipeline plus "lost" reachable from any non-terminal state. A site visit can
// be scheduled straight from `new` or `contacted`, and after the visit the lead moves on
// to negotiating or converts directly.
const ALLOWED_TRANSITIONS: Record<LeadStatus, readonly LeadStatus[]> = {
  new: ["contacted", "site_visit_scheduled", "lost"],
  contacted: ["site_visit_scheduled", "negotiating", "lost"],
  site_visit_scheduled: ["negotiating", "converted", "lost"],
  negotiating: ["converted", "lost"],
  converted: [],
  lost: [],
};

export function canTransitionLeadStatus(from: unknown, to: unknown): boolean {
  if (!isLeadStatus(from) || !isLeadStatus(to)) {
    return false; // fail closed on unknown values
  }
  if (from === to) {
    return true; // idempotent no-op is allowed
  }
  return ALLOWED_TRANSITIONS[from].includes(to);
}
