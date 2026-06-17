// Admin-account management (Owner-only, prj.md Section 9). Every mutation gates on
// the pure rules in admin-rules.ts BEFORE touching the database, so the single-Owner
// invariant is enforced server-side and cannot be bypassed from the UI.

import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";
import { assertCanCreateAdmin, assertCanDeleteAdmin } from "./admin-rules";
import { createCredentialedUser, type SafeUser } from "./users";

export type CreateAdminInput = {
  actorRole: unknown;
  email: string;
  password: string;
  name: string;
};

export type DeleteAdminInput = {
  actorRole: unknown;
  targetUserId: string;
};

const SAFE_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
} as const;

// Owner-only. The created account is always ADMIN - a second OWNER can never be made.
export async function createAdmin(input: CreateAdminInput): Promise<SafeUser> {
  assertCanCreateAdmin(input.actorRole);
  return createCredentialedUser({
    email: input.email,
    password: input.password,
    name: input.name,
    role: "ADMIN",
  });
}

// Owner-only. Never deletes an OWNER account (guarded by assertCanDeleteAdmin).
export async function deleteAdmin(input: DeleteAdminInput): Promise<void> {
  const target = await prisma.user.findUnique({
    where: { id: input.targetUserId },
    select: { id: true, role: true },
  });
  if (!target) {
    throw new NotFoundError("User not found.");
  }
  assertCanDeleteAdmin(input.actorRole, target.role);
  await prisma.user.delete({ where: { id: target.id } });
}

export async function listAdmins(): Promise<SafeUser[]> {
  return prisma.user.findMany({
    where: { role: "ADMIN" },
    select: SAFE_USER_SELECT,
    orderBy: { createdAt: "asc" },
  });
}
