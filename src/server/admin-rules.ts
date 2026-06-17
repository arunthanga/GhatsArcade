// Pure authorization rules for admin-account management (prj.md Section 9).
// No DB / env / Better Auth imports here, so this is fast to unit-test and is the
// single place the single-Owner invariant is enforced before any persistence.

import { AuthorizationError } from "@/lib/errors";
import { can, canAssignRole, canDeleteAccountWithRole } from "@/lib/roles";

// The actor (must be OWNER) may create a new Admin account.
// Fail-closed: unknown/Admin actors are rejected. The created role is always ADMIN -
// a second OWNER can never be created (canAssignRole excludes OWNER).
export function assertCanCreateAdmin(actorRole: unknown): void {
  if (!can(actorRole, "admin:add")) {
    throw new AuthorizationError("Only the Owner can add admin accounts.");
  }
  if (!canAssignRole("ADMIN")) {
    // Defensive: ADMIN must always be assignable; guards against regressions.
    throw new AuthorizationError("Cannot assign the requested role.");
  }
}

// The actor (must be OWNER) may delete an account, but never an OWNER account.
export function assertCanDeleteAdmin(actorRole: unknown, targetRole: unknown): void {
  if (!can(actorRole, "admin:delete")) {
    throw new AuthorizationError("Only the Owner can delete admin accounts.");
  }
  if (!canDeleteAccountWithRole(targetRole)) {
    throw new AuthorizationError("The Owner account can never be deleted.");
  }
}
