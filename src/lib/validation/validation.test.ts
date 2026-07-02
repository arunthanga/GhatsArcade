import { describe, expect, it } from "vitest";
import { createListingSchema, listingFilterSchema, updateListingSchema } from "./index";

const validListing = {
  title: "5 Acre Cardamom Estate",
  description: "Productive cardamom estate near the Kerala-TN border.",
  district: "Idukki",
  landType: "agricultural",
  sizeAcres: 5,
  priceInr: 7500000,
};

describe("createListingSchema", () => {
  it("accepts a valid payload and defaults status to draft", () => {
    const parsed = createListingSchema.parse(validListing);
    expect(parsed.status).toBe("draft");
    expect(parsed.keralaTnBorder).toBe(false);
  });

  it("does not accept a slug (auto-generated server-side)", () => {
    const parsed = createListingSchema.parse({ ...validListing, slug: "hacked" });
    expect(parsed).not.toHaveProperty("slug");
  });

  it("rejects non-positive size and negative price", () => {
    expect(createListingSchema.safeParse({ ...validListing, sizeAcres: 0 }).success).toBe(false);
    expect(createListingSchema.safeParse({ ...validListing, priceInr: -1 }).success).toBe(false);
  });

  it("rejects an unknown land type", () => {
    expect(createListingSchema.safeParse({ ...validListing, landType: "industrial" }).success).toBe(
      false,
    );
  });

  it("validates nested photo URLs", () => {
    expect(
      createListingSchema.safeParse({
        ...validListing,
        photos: [{ url: "not-a-url" }],
      }).success,
    ).toBe(false);

    expect(
      createListingSchema.safeParse({
        ...validListing,
        photos: [{ url: "https://cdn.example.com/a.jpg", alt: "estate", sortOrder: 0 }],
      }).success,
    ).toBe(true);
  });
});

describe("updateListingSchema", () => {
  it("allows partial updates", () => {
    const parsed = updateListingSchema.parse({ priceInr: 9000000 });
    expect(parsed.priceInr).toBe(9000000);
    expect(parsed.title).toBeUndefined();
  });
});

describe("listingFilterSchema", () => {
  it("coerces numeric and boolean query strings", () => {
    const parsed = listingFilterSchema.parse({
      district: "Idukki",
      minPriceInr: "1000000",
      maxAcres: "10",
      keralaTnBorder: "true",
    });
    expect(parsed.minPriceInr).toBe(1000000);
    expect(parsed.maxAcres).toBe(10);
    expect(parsed.keralaTnBorder).toBe(true);
  });

  it("treats 'false' as false", () => {
    expect(listingFilterSchema.parse({ keralaTnBorder: "false" }).keralaTnBorder).toBe(false);
  });

  it("accepts an empty filter object", () => {
    expect(listingFilterSchema.parse({})).toEqual({});
  });
});
