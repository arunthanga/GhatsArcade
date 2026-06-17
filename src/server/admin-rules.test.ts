import { describe, expect, it } from "vitest";
import { AuthorizationError } from "@/lib/errors";
import { assertCanCreateAdmin, assertCanDeleteAdmin } from "./admin-rules";

describe("assertCanCreateAdmin", () => {
  it("allows the Owner to create an admin", () => {
    expect(() => assertCanCreateAdmin("OWNER")).not.toThrow();
  });

  it("rejects an Admin actor (Owner-only)", () => {
    expect(() => assertCanCreateAdmin("ADMIN")).toThrow(AuthorizationError);
  });

  it("rejects unknown/undefined actor roles (fail-closed)", () => {
    expect(() => assertCanCreateAdmin("hacker")).toThrow(AuthorizationError);
    expect(() => assertCanCreateAdmin(undefined)).toThrow(AuthorizationError);
    expect(() => assertCanCreateAdmin(null)).toThrow(AuthorizationError);
  });
});

describe("assertCanDeleteAdmin", () => {
  it("allows the Owner to delete an Admin account", () => {
    expect(() => assertCanDeleteAdmin("OWNER", "ADMIN")).not.toThrow();
  });

  it("never allows deleting an Owner account, even by the Owner", () => {
    expect(() => assertCanDeleteAdmin("OWNER", "OWNER")).toThrow(AuthorizationError);
  });

  it("rejects an Admin actor", () => {
    expect(() => assertCanDeleteAdmin("ADMIN", "ADMIN")).toThrow(AuthorizationError);
  });

  it("rejects unknown actor or target roles (fail-closed)", () => {
    expect(() => assertCanDeleteAdmin("hacker", "ADMIN")).toThrow(AuthorizationError);
    expect(() => assertCanDeleteAdmin("OWNER", "unknown")).toThrow(AuthorizationError);
    expect(() => assertCanDeleteAdmin(undefined, undefined)).toThrow(AuthorizationError);
  });
});
