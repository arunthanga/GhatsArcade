import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import type { CreateBlogPostInput } from "@/lib/validation";
import { prisma, resetDb } from "../../tests/helpers/db";
import { createOwner } from "../../tests/helpers/factories";
import {
  createBlogPost,
  deleteBlogPost,
  getPublicPostBySlug,
  listAllPosts,
  listPublishedPosts,
  listRelatedPostsForListing,
  updateBlogPost,
} from "./blog";

let authorId: string;

const base: CreateBlogPostInput = {
  title: "Why the Kerala-TN border",
  body: "Long form content.",
  category: "location_spotlight",
  status: "draft",
};

beforeEach(async () => {
  await resetDb();
  const owner = await createOwner();
  authorId = owner.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("createBlogPost", () => {
  it("lets an Admin create a draft (no publishedAt) with a generated slug", async () => {
    const post = await createBlogPost({ actorRole: "ADMIN", authorId, data: base });
    expect(post.slug).toBe("why-the-kerala-tn-border");
    expect(post.status).toBe("draft");
    expect(post.publishedAt).toBeNull();
  });

  it("stamps publishedAt when created as published", async () => {
    const post = await createBlogPost({
      actorRole: "OWNER",
      authorId,
      data: { ...base, status: "published" },
    });
    expect(post.publishedAt).not.toBeNull();
  });

  it("denies unknown roles and generates unique slugs", async () => {
    await expect(
      createBlogPost({ actorRole: "guest", authorId, data: base }),
    ).rejects.toBeInstanceOf(AuthorizationError);

    const a = await createBlogPost({ actorRole: "OWNER", authorId, data: base });
    const b = await createBlogPost({ actorRole: "OWNER", authorId, data: base });
    expect(a.slug).toBe("why-the-kerala-tn-border");
    expect(b.slug).toBe("why-the-kerala-tn-border-2");
  });
});

describe("public reads", () => {
  it("hides drafts and shows published posts", async () => {
    await createBlogPost({ actorRole: "OWNER", authorId, data: { ...base, title: "Draft One" } });
    await createBlogPost({
      actorRole: "OWNER",
      authorId,
      data: { ...base, title: "Live One", status: "published" },
    });

    const published = await listPublishedPosts();
    expect(published).toHaveLength(1);
    expect(published[0]?.title).toBe("Live One");

    expect(await getPublicPostBySlug("live-one")).not.toBeNull();
    expect(await getPublicPostBySlug("draft-one")).toBeNull();
  });

  it("returns only published related posts for listing detail pages", async () => {
    await createBlogPost({
      actorRole: "OWNER",
      authorId,
      data: {
        ...base,
        title: "Idukki Title Guide",
        body: "Idukki land basics",
        status: "published",
      },
    });
    await createBlogPost({
      actorRole: "OWNER",
      authorId,
      data: {
        ...base,
        title: "Draft Idukki Guide",
        body: "Idukki draft",
        status: "draft",
      },
    });

    const related = await listRelatedPostsForListing({ district: "Idukki" });
    expect(related).toHaveLength(1);
    expect(related[0]?.title).toBe("Idukki Title Guide");
  });
});

describe("updateBlogPost", () => {
  it("sets publishedAt on publish and clears it on unpublish", async () => {
    const post = await createBlogPost({ actorRole: "OWNER", authorId, data: base });

    const published = await updateBlogPost({
      actorRole: "OWNER",
      id: post.id,
      data: { status: "published" },
    });
    expect(published.publishedAt).not.toBeNull();
    const firstStamp = published.publishedAt;

    // Editing while still published preserves the original timestamp.
    const edited = await updateBlogPost({
      actorRole: "OWNER",
      id: post.id,
      data: { body: "updated" },
    });
    expect(edited.publishedAt).toEqual(firstStamp);

    const unpublished = await updateBlogPost({
      actorRole: "OWNER",
      id: post.id,
      data: { status: "draft" },
    });
    expect(unpublished.publishedAt).toBeNull();
  });

  it("throws NotFoundError for a missing post", async () => {
    await expect(
      updateBlogPost({ actorRole: "OWNER", id: "nope", data: { body: "x" } }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("deleteBlogPost / listAllPosts", () => {
  it("deletes a post", async () => {
    const post = await createBlogPost({ actorRole: "OWNER", authorId, data: base });
    await deleteBlogPost({ actorRole: "OWNER", id: post.id });
    expect(await prisma.blogPost.findUnique({ where: { id: post.id } })).toBeNull();
  });

  it("lists all posts for an admin and denies unknown roles", async () => {
    await createBlogPost({ actorRole: "OWNER", authorId, data: base });
    await createBlogPost({
      actorRole: "OWNER",
      authorId,
      data: { ...base, title: "Second", status: "published" },
    });
    expect(await listAllPosts({ actorRole: "ADMIN" })).toHaveLength(2);
    await expect(listAllPosts({ actorRole: "guest" })).rejects.toBeInstanceOf(AuthorizationError);
  });
});
