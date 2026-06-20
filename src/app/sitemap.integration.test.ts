import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma, resetDb } from "../../tests/helpers/db";
import { createOwner } from "../../tests/helpers/factories";
import { createBlogPost } from "@/server/blog";
import { createListing } from "@/server/listings";
import sitemap from "./sitemap";

let ownerId: string;

beforeEach(async () => {
  await resetDb();
  ownerId = (await createOwner()).id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("sitemap", () => {
  it("includes published listings and posts but excludes drafts", async () => {
    await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: {
        title: "Published Listing",
        description: "x",
        district: "Idukki",
        landType: "agricultural",
        sizeAcres: 2,
        priceInr: 1_000_000,
        keralaTnBorder: false,
        status: "published",
      },
    });
    await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: {
        title: "Draft Listing",
        description: "x",
        district: "Idukki",
        landType: "agricultural",
        sizeAcres: 2,
        priceInr: 1_000_000,
        keralaTnBorder: false,
        status: "draft",
      },
    });

    await createBlogPost({
      actorRole: "OWNER",
      authorId: ownerId,
      data: {
        title: "Published Post",
        body: "Body.",
        category: "lifestyle",
        status: "published",
      },
    });
    await createBlogPost({
      actorRole: "OWNER",
      authorId: ownerId,
      data: {
        title: "Draft Post",
        body: "Body.",
        category: "lifestyle",
        status: "draft",
      },
    });

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls.some((u) => u.endsWith("/listings/published-listing"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/blog/published-post"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/listings/draft-listing"))).toBe(false);
    expect(urls.some((u) => u.endsWith("/blog/draft-post"))).toBe(false);
  });
});
