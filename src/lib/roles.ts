// SECURITY-CRITICAL: roles & permissions (prj.md Section 9).
//
// Pure, dependency-free, and independently tested. Requires 100% branch coverage.
// Hard invariant: exactly one OWNER; the OWNER role can never be assigned, removed,
// or duplicated through any code path. Unknown roles fail closed (deny everything).

import { type Role, ROLES } from "@/types";

export const ACTIONS = [
  "listing:manage",
  "blog:manage",
  "lead:view",
  "lead:update",
  "admin:add",
  "admin:delete",
  "data:export",
] as const;

export type Action = (typeof ACTIONS)[number];

const OWNER_ONLY_ACTIONS: ReadonlySet<Action> = new Set<Action>([
  "admin:add",
  "admin:delete",
  "data:export",
]);

const SHARED_ACTIONS: ReadonlySet<Action> = new Set<Action>([
  "listing:manage",
  "blog:manage",
  "lead:view",
  "lead:update",
]);

const PERMISSIONS: Record<Role, ReadonlySet<Action>> = {
  OWNER: new Set<Action>(ACTIONS),
  ADMIN: SHARED_ACTIONS,
};

/** Type guard: is the value one of the known roles? */
export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function isOwner(role: unknown): boolean {
  return role === "OWNER";
}

/**
 * Can `role` perform `action`? Fail-closed: any unknown/undefined role is denied.
 */
export function can(role: unknown, action: Action): boolean {
  if (!isRole(role)) {
    return false;
  }
  return PERMISSIONS[role].has(action);
}

/** Owner-only actions are a fixed, closed set (used by the admin UI/guards). */
export function isOwnerOnlyAction(action: Action): boolean {
  return OWNER_ONLY_ACTIONS.has(action);
}

/**
 * Roles that may ever be assigned to an account through application code.
 * OWNER is intentionally excluded so a second Owner can never be created.
 */
export function canAssignRole(target: unknown): target is "ADMIN" {
  return target === "ADMIN";
}

/** The OWNER account can never be deleted; only ADMINs may be removed. */
export function canDeleteAccountWithRole(role: unknown): boolean {
  return role === "ADMIN";
}

/** The system is valid only when there is exactly one OWNER account. */
export function isValidOwnerCount(count: number): boolean {
  return count === 1;
}
