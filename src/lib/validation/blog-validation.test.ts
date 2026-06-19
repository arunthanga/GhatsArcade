import { describe, expect, it } from "vitest";
import { createBlogPostSchema, updateBlogPostSchema } from "./index";

const validPost = {
  title: "Why the Kerala-TN border?",
  body: "A long-form post about the region.",
};

describe("createBlogPostSchema", () => {
  it("accepts a valid post and defaults status to draft and category to lifestyle", () => {
    const parsed = createBlogPostSchema.parse(validPost);
    expect(parsed.status).toBe("draft");
    expect(parsed.category).toBe("lifestyle");
  });

  it("rejects an unknown category", () => {
    expect(createBlogPostSchema.safeParse({ ...validPost, category: "nope" }).success).toBe(false);
    expect(
      createBlogPostSchema.safeParse({ ...validPost, category: "myth_busting" }).success,
    ).toBe(true);
  });

  it("validates SEO fields and reading-time override", () => {
    expect(
      createBlogPostSchema.safeParse({ ...validPost, metaTitle: "x".repeat(71) }).success,
    ).toBe(false);
    expect(
      createBlogPostSchema.safeParse({ ...validPost, ogImageUrl: "not-a-url" }).success,
    ).toBe(false);
    expect(createBlogPostSchema.safeParse({ ...validPost, ogImageUrl: "" }).success).toBe(true);
    expect(
      createBlogPostSchema.safeParse({ ...validPost, estimatedReadMinutes: 0 }).success,
    ).toBe(false);
    const parsed = createBlogPostSchema.parse({ ...validPost, estimatedReadMinutes: "7" });
    expect(parsed.estimatedReadMinutes).toBe(7);
  });

  it("requires title and body", () => {
    expect(createBlogPostSchema.safeParse({ ...validPost, title: "" }).success).toBe(false);
    expect(createBlogPostSchema.safeParse({ ...validPost, body: "" }).success).toBe(false);
  });

  it("validates the optional cover image URL", () => {
    expect(createBlogPostSchema.safeParse({ ...validPost, coverImage: "nope" }).success).toBe(false);
    expect(
      createBlogPostSchema.safeParse({ ...validPost, coverImage: "https://cdn.example.com/c.jpg" })
        .success,
    ).toBe(true);
  });

  it("rejects an unknown status", () => {
    expect(createBlogPostSchema.safeParse({ ...validPost, status: "archived" }).success).toBe(false);
  });

  it("does not accept a slug", () => {
    const parsed = createBlogPostSchema.parse({ ...validPost, slug: "hacked" });
    expect(parsed).not.toHaveProperty("slug");
  });
});

describe("updateBlogPostSchema", () => {
  it("allows partial updates", () => {
    const parsed = updateBlogPostSchema.parse({ status: "published" });
    expect(parsed.status).toBe("published");
    expect(parsed.title).toBeUndefined();
  });
});
