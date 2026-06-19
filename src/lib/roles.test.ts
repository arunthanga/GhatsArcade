import { describe, expect, it } from "vitest";
import {
  ACTIONS,
  type Action,
  can,
  canAssignRole,
  canDeleteAccountWithRole,
  isOwner,
  isOwnerOnlyAction,
  isRole,
  isValidOwnerCount,
} from "./roles";

const OWNER_ONLY: Action[] = ["admin:add", "admin:delete", "data:export"];
const SHARED: Action[] = [
  "listing:manage",
  "project:manage",
  "blog:manage",
  "leadMagnet:manage",
  "event:manage",
  "testimonial:manage",
  "lead:view",
  "lead:update",
];

describe("isRole", () => {
  it("accepts known roles", () => {
    expect(isRole("OWNER")).toBe(true);
    expect(isRole("ADMIN")).toBe(true);
  });

  it("rejects unknown / malformed values (fail-closed)", () => {
    expect(isRole("owner")).toBe(false);
    expect(isRole("SUPERADMIN")).toBe(false);
    expect(isRole("")).toBe(false);
    expect(isRole(undefined)).toBe(false);
    expect(isRole(null)).toBe(false);
    expect(isRole(42)).toBe(false);
  });
});

describe("can - Owner", () => {
  it("permits every action", () => {
    for (const action of ACTIONS) {
      expect(can("OWNER", action)).toBe(true);
    }
  });
});

describe("can - Admin", () => {
  it("permits shared actions", () => {
    for (const action of SHARED) {
      expect(can("ADMIN", action)).toBe(true);
    }
  });

  it("denies Owner-only actions", () => {
    for (const action of OWNER_ONLY) {
      expect(can("ADMIN", action)).toBe(false);
    }
  });
});

describe("can - unknown role fails closed", () => {
  it("denies all actions for any unknown role", () => {
    for (const action of ACTIONS) {
      expect(can("hacker", action)).toBe(false);
      expect(can(undefined, action)).toBe(false);
      expect(can(null, action)).toBe(false);
    }
  });
});

describe("isOwner", () => {
  it("is true only for OWNER", () => {
    expect(isOwner("OWNER")).toBe(true);
    expect(isOwner("ADMIN")).toBe(false);
    expect(isOwner("anything")).toBe(false);
  });
});

describe("isOwnerOnlyAction", () => {
  it("flags the three Owner-only actions", () => {
    for (const action of OWNER_ONLY) {
      expect(isOwnerOnlyAction(action)).toBe(true);
    }
    for (const action of SHARED) {
      expect(isOwnerOnlyAction(action)).toBe(false);
    }
  });
});

describe("Owner immutability invariant", () => {
  it("never allows assigning the OWNER role", () => {
    expect(canAssignRole("ADMIN")).toBe(true);
    expect(canAssignRole("OWNER")).toBe(false);
    expect(canAssignRole("unknown")).toBe(false);
  });

  it("never allows deleting an OWNER account", () => {
    expect(canDeleteAccountWithRole("ADMIN")).toBe(true);
    expect(canDeleteAccountWithRole("OWNER")).toBe(false);
    expect(canDeleteAccountWithRole("unknown")).toBe(false);
  });

  it("treats exactly one Owner as the only valid state", () => {
    expect(isValidOwnerCount(1)).toBe(true);
    expect(isValidOwnerCount(0)).toBe(false);
    expect(isValidOwnerCount(2)).toBe(false);
  });
});
