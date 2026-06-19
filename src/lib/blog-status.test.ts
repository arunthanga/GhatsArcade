import { describe, expect, it } from "vitest";
import { isBlogPubliclyVisible, isBlogStatus, resolvePublishedAt } from "./blog-status";

const NOW = new Date("2026-02-01T00:00:00.000Z");
const EARLIER = new Date("2026-01-01T00:00:00.000Z");

describe("isBlogStatus", () => {
  it("accepts known statuses, rejects others (fail-closed)", () => {
    expect(isBlogStatus("draft")).toBe(true);
    expect(isBlogStatus("published")).toBe(true);
    expect(isBlogStatus("archived")).toBe(false);
    expect(isBlogStatus(undefined)).toBe(false);
  });
});

describe("isBlogPubliclyVisible", () => {
  it("is true only for published", () => {
    expect(isBlogPubliclyVisible("published")).toBe(true);
    expect(isBlogPubliclyVisible("draft")).toBe(false);
    expect(isBlogPubliclyVisible("nonsense")).toBe(false);
  });
});

describe("resolvePublishedAt", () => {
  it("stamps now on first publish", () => {
    expect(resolvePublishedAt("draft", "published", null, NOW)).toEqual(NOW);
  });

  it("preserves the original timestamp on re-publish edits", () => {
    expect(resolvePublishedAt("published", "published", EARLIER, NOW)).toEqual(EARLIER);
  });

  it("clears the timestamp when reverting to draft", () => {
    expect(resolvePublishedAt("published", "draft", EARLIER, NOW)).toBeNull();
  });

  it("returns null for unknown next status (fail-closed)", () => {
    expect(resolvePublishedAt("published", "archived", EARLIER, NOW)).toBeNull();
  });
});
