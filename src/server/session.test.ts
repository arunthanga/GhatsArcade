import { beforeEach, describe, expect, it, vi } from "vitest";

// redirect() in Next throws to halt rendering; emulate that so control-flow matches.
class RedirectError extends Error {
  constructor(public to: string) {
    super(`REDIRECT:${to}`);
  }
}

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((to: string) => {
    throw new RedirectError(to);
  }),
}));

const getSession = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: (args: unknown) => getSession(args) } },
}));

import { getCurrentUser, requirePermission, requireUser } from "./session";

const ownerSession = {
  user: { id: "u1", email: "owner@example.com", name: "Owner", role: "OWNER" },
};
const adminSession = {
  user: { id: "u2", email: "admin@example.com", name: "Admin", role: "ADMIN" },
};

beforeEach(() => {
  getSession.mockReset();
});

describe("getCurrentUser", () => {
  it("maps the Better Auth session user", async () => {
    getSession.mockResolvedValue(ownerSession);
    await expect(getCurrentUser()).resolves.toEqual({
      id: "u1",
      email: "owner@example.com",
      name: "Owner",
      role: "OWNER",
    });
  });

  it("returns null when there is no session", async () => {
    getSession.mockResolvedValue(null);
    await expect(getCurrentUser()).resolves.toBeNull();
  });
});

describe("requireUser", () => {
  it("redirects to /admin/login when unauthenticated", async () => {
    getSession.mockResolvedValue(null);
    await expect(requireUser()).rejects.toMatchObject({ to: "/admin/login" });
  });

  it("returns the user when authenticated", async () => {
    getSession.mockResolvedValue(adminSession);
    await expect(requireUser()).resolves.toMatchObject({ role: "ADMIN" });
  });
});

describe("requirePermission", () => {
  it("redirects an Admin to the dashboard for an Owner-only action", async () => {
    getSession.mockResolvedValue(adminSession);
    await expect(requirePermission("admin:add")).rejects.toMatchObject({
      to: "/admin/dashboard",
    });
  });

  it("allows the Owner through for an Owner-only action", async () => {
    getSession.mockResolvedValue(ownerSession);
    await expect(requirePermission("admin:add")).resolves.toMatchObject({ role: "OWNER" });
  });

  it("allows shared actions for an Admin", async () => {
    getSession.mockResolvedValue(adminSession);
    await expect(requirePermission("listing:manage")).resolves.toMatchObject({ role: "ADMIN" });
  });
});
