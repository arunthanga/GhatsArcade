import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { isValidOwnerCount } from "@/lib/roles";
import { prisma, resetDb } from "../../tests/helpers/db";
import { createAdminUser, createOwner } from "../../tests/helpers/factories";
import { createAdmin, deleteAdmin, listAdmins } from "./admins";

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("createAdmin", () => {
  it("lets the Owner create an Admin that persists with role ADMIN + a credential account", async () => {
    await createOwner();

    const created = await createAdmin({
      actorRole: "OWNER",
      email: "newadmin@example.com",
      password: "a-strong-password",
      name: "New Admin",
    });

    expect(created.role).toBe("ADMIN");

    const persisted = await prisma.user.findUnique({
      where: { id: created.id },
      include: { accounts: true },
    });
    expect(persisted?.role).toBe("ADMIN");
    expect(persisted?.accounts.some((a) => a.providerId === "credential")).toBe(true);

    // The single-Owner invariant still holds: creating admins never adds an Owner.
    const ownerCount = await prisma.user.count({ where: { role: "OWNER" } });
    expect(isValidOwnerCount(ownerCount)).toBe(true);
  });

  it("blocks a non-Owner (Admin) caller", async () => {
    await expect(
      createAdmin({
        actorRole: "ADMIN",
        email: "x@example.com",
        password: "pw-12345678",
        name: "X",
      }),
    ).rejects.toBeInstanceOf(AuthorizationError);

    expect(await prisma.user.count()).toBe(0);
  });
});

describe("deleteAdmin", () => {
  it("lets the Owner delete an Admin", async () => {
    await createOwner();
    const admin = await createAdminUser({ email: "todelete@example.com" });

    await deleteAdmin({ actorRole: "OWNER", targetUserId: admin.id });

    expect(await prisma.user.findUnique({ where: { id: admin.id } })).toBeNull();
  });

  it("never deletes the Owner account", async () => {
    const owner = await createOwner();

    await expect(
      deleteAdmin({ actorRole: "OWNER", targetUserId: owner.id }),
    ).rejects.toBeInstanceOf(AuthorizationError);

    expect(await prisma.user.findUnique({ where: { id: owner.id } })).not.toBeNull();
  });

  it("throws NotFoundError for a missing user", async () => {
    await createOwner();
    await expect(
      deleteAdmin({ actorRole: "OWNER", targetUserId: "does-not-exist" }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("listAdmins", () => {
  it("returns only Admin accounts, not the Owner", async () => {
    await createOwner();
    await createAdminUser({ email: "a1@example.com" });
    await createAdminUser({ email: "a2@example.com" });

    const admins = await listAdmins();
    expect(admins).toHaveLength(2);
    expect(admins.every((a) => a.role === "ADMIN")).toBe(true);
  });
});
