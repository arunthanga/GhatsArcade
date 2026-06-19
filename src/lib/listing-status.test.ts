import { describe, expect, it } from "vitest";
import {
  canTransitionStatus,
  isListingStatus,
  isPubliclyVisible,
  PUBLIC_LISTING_STATUSES,
} from "./listing-status";

describe("isListingStatus", () => {
  it("accepts known statuses and rejects others (fail-closed)", () => {
    expect(isListingStatus("draft")).toBe(true);
    expect(isListingStatus("sold")).toBe(true);
    expect(isListingStatus("PUBLISHED")).toBe(false);
    expect(isListingStatus("")).toBe(false);
    expect(isListingStatus(undefined)).toBe(false);
    expect(isListingStatus(null)).toBe(false);
    expect(isListingStatus(7)).toBe(false);
  });
});

describe("isPubliclyVisible", () => {
  it("is true only for published and under_offer", () => {
    expect(isPubliclyVisible("published")).toBe(true);
    expect(isPubliclyVisible("under_offer")).toBe(true);
    expect(isPubliclyVisible("draft")).toBe(false);
    expect(isPubliclyVisible("sold")).toBe(false);
    expect(isPubliclyVisible("nonsense")).toBe(false);
  });

  it("matches the exported public set", () => {
    for (const status of PUBLIC_LISTING_STATUSES) {
      expect(isPubliclyVisible(status)).toBe(true);
    }
  });
});

describe("canTransitionStatus", () => {
  it("allows the documented forward/back transitions", () => {
    expect(canTransitionStatus("draft", "published")).toBe(true);
    expect(canTransitionStatus("published", "under_offer")).toBe(true);
    expect(canTransitionStatus("published", "sold")).toBe(true);
    expect(canTransitionStatus("published", "draft")).toBe(true);
    expect(canTransitionStatus("under_offer", "published")).toBe(true);
    expect(canTransitionStatus("under_offer", "sold")).toBe(true);
  });

  it("allows idempotent no-op (same status)", () => {
    expect(canTransitionStatus("draft", "draft")).toBe(true);
    expect(canTransitionStatus("sold", "sold")).toBe(true);
  });

  it("treats sold as terminal", () => {
    expect(canTransitionStatus("sold", "published")).toBe(false);
    expect(canTransitionStatus("sold", "draft")).toBe(false);
    expect(canTransitionStatus("sold", "under_offer")).toBe(false);
  });

  it("rejects illegal jumps", () => {
    expect(canTransitionStatus("draft", "sold")).toBe(false);
    expect(canTransitionStatus("draft", "under_offer")).toBe(false);
  });

  it("fails closed on unknown statuses", () => {
    expect(canTransitionStatus("draft", "archived")).toBe(false);
    expect(canTransitionStatus("unknown", "published")).toBe(false);
    expect(canTransitionStatus(undefined, undefined)).toBe(false);
  });
});
