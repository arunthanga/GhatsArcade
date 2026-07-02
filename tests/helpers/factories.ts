import { createCredentialedUser, type SafeUser } from "@/server/users";

let counter = 0;
function unique(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export function createOwner(
  overrides: Partial<{ email: string; password: string; name: string }> = {},
): Promise<SafeUser> {
  return createCredentialedUser({
    email: overrides.email ?? `${unique("owner")}@example.com`,
    password: overrides.password ?? "owner-password-123",
    name: overrides.name ?? "Test Owner",
    role: "OWNER",
  });
}

export function createAdminUser(
  overrides: Partial<{ email: string; password: string; name: string }> = {},
): Promise<SafeUser> {
  return createCredentialedUser({
    email: overrides.email ?? `${unique("admin")}@example.com`,
    password: overrides.password ?? "admin-password-123",
    name: overrides.name ?? "Test Admin",
    role: "ADMIN",
  });
}
