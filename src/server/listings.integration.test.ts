import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import type { CreateListingInput } from "@/lib/validation";
import { prisma, resetDb } from "../../tests/helpers/db";
import { createOwner } from "../../tests/helpers/factories";
import {
  createListing,
  deleteListing,
  getPublicListingBySlug,
  listAllListings,
  listPublicListings,
  updateListing,
} from "./listings";

let ownerId: string;

const baseData: CreateListingInput = {
  title: "5 Acre Cardamom Estate",
  description: "Productive estate near the border.",
  district: "Idukki",
  landType: "agricultural",
  sizeAcres: 5,
  priceInr: 7_500_000,
  keralaTnBorder: false,
  status: "draft",
};

beforeEach(async () => {
  await resetDb();
  const owner = await createOwner();
  ownerId = owner.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("createListing", () => {
  it("lets an Admin create a listing with a generated slug and photos", async () => {
    const listing = await createListing({
      actorRole: "ADMIN",
      createdById: ownerId,
      data: {
        ...baseData,
        status: "published",
        photos: [{ url: "https://cdn.example.com/a.jpg", alt: "front" }],
      },
    });

    expect(listing.slug).toBe("5-acre-cardamom-estate");
    expect(listing.photos).toHaveLength(1);
    expect(listing.photos[0]?.url).toBe("https://cdn.example.com/a.jpg");
  });

  it("denies an unknown role and persists nothing", async () => {
    await expect(
      createListing({ actorRole: "guest", createdById: ownerId, data: baseData }),
    ).rejects.toBeInstanceOf(AuthorizationError);
    expect(await prisma.listing.count()).toBe(0);
  });

  it("generates unique slugs for duplicate titles", async () => {
    const first = await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: baseData,
    });
    const second = await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: baseData,
    });
    expect(first.slug).toBe("5-acre-cardamom-estate");
    expect(second.slug).toBe("5-acre-cardamom-estate-2");
  });

  // Collision strategy: identical titles must append -2, -3, ... and never throw a
  // Prisma unique-constraint error on the `slug` column.
  it("appends an incrementing suffix for repeated title collisions", async () => {
    const titleData = { ...baseData, title: "Wayanad Farm" };
    const a = await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: titleData,
    });
    const b = await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: titleData,
    });
    const c = await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: titleData,
    });

    expect(a.slug).toBe("wayanad-farm");
    expect(b.slug).toBe("wayanad-farm-2");
    expect(c.slug).toBe("wayanad-farm-3");

    const slugs = await prisma.listing.findMany({ select: { slug: true } });
    expect(new Set(slugs.map((s) => s.slug)).size).toBe(3);
  });
});

describe("public reads", () => {
  beforeEach(async () => {
    await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: { ...baseData, title: "Published Plot", status: "published", district: "Idukki" },
    });
    await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: { ...baseData, title: "Draft Plot", status: "draft" },
    });
    await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: { ...baseData, title: "Sold Plot", status: "sold", priceInr: 20_000_000 },
    });
  });

  it("listPublicListings returns only publicly visible listings", async () => {
    const listings = await listPublicListings();
    expect(listings).toHaveLength(1);
    expect(listings[0]?.title).toBe("Published Plot");
  });

  it("getPublicListingBySlug hides non-visible listings", async () => {
    expect(await getPublicListingBySlug("published-plot")).not.toBeNull();
    expect(await getPublicListingBySlug("draft-plot")).toBeNull();
    expect(await getPublicListingBySlug("sold-plot")).toBeNull();
  });

  it("applies filters", async () => {
    await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: { ...baseData, title: "Wayanad Big", status: "published", district: "Wayanad", priceInr: 15_000_000, sizeAcres: 12 },
    });

    expect(await listPublicListings({ district: "Wayanad" })).toHaveLength(1);
    expect(await listPublicListings({ maxPriceInr: 8_000_000 })).toHaveLength(1);
    expect(await listPublicListings({ minAcres: 10 })).toHaveLength(1);
  });
});

describe("updateListing", () => {
  it("rejects an illegal status transition", async () => {
    const listing = await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: { ...baseData, status: "draft" },
    });
    await expect(
      updateListing({ actorRole: "OWNER", id: listing.id, data: { status: "sold" } }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("allows a legal transition and field edits", async () => {
    const listing = await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: { ...baseData, status: "published" },
    });
    const updated = await updateListing({
      actorRole: "OWNER",
      id: listing.id,
      data: { status: "under_offer", priceInr: 9_000_000 },
    });
    expect(updated.status).toBe("under_offer");
    expect(updated.priceInr).toBe(9_000_000);
  });

  it("throws NotFoundError for a missing listing", async () => {
    await expect(
      updateListing({ actorRole: "OWNER", id: "nope", data: { priceInr: 1 } }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("deleteListing", () => {
  it("deletes an existing listing", async () => {
    const listing = await createListing({ actorRole: "OWNER", createdById: ownerId, data: baseData });
    await deleteListing({ actorRole: "OWNER", id: listing.id });
    expect(await prisma.listing.findUnique({ where: { id: listing.id } })).toBeNull();
  });

  it("throws NotFoundError for a missing listing", async () => {
    await expect(deleteListing({ actorRole: "OWNER", id: "nope" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});

describe("listAllListings", () => {
  it("returns every status for an admin and denies unknown roles", async () => {
    await createListing({ actorRole: "OWNER", createdById: ownerId, data: { ...baseData, status: "draft" } });
    await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: { ...baseData, title: "Another", status: "published" },
    });

    expect(await listAllListings({ actorRole: "ADMIN" })).toHaveLength(2);
    await expect(listAllListings({ actorRole: "guest" })).rejects.toBeInstanceOf(AuthorizationError);
  });
});
