import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Role } from "@/types";

export type CreateCredentialedUserInput = {
  email: string;
  password: string;
  name: string;
  role: Role;
};

export type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
};

// Creates a user plus a Better Auth email/password credential account.
// Uses Better Auth's password hashing context so the resulting account is
// sign-in compatible. This is the low-level primitive used by the Owner seed,
// test factories, and admin creation (which gate on role BEFORE calling this).
export async function createCredentialedUser(
  input: CreateCredentialedUserInput,
): Promise<SafeUser> {
  const ctx = await auth.$context;
  const hashed = await ctx.password.hash(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      role: input.role,
      emailVerified: true,
      isActive: true,
      accounts: {
        create: {
          accountId: input.email,
          providerId: "credential",
          password: hashed,
        },
      },
    },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });

  return user;
}
