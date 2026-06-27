// Blog / CMS service layer (prj.md Section 3). All writes funnel through here so role
// checks (src/lib/roles.ts) are enforced server-side. Public reads are unauthenticated
// but restricted to published posts via src/lib/blog-status.ts.

import { isBlogPubliclyVisible, resolvePublishedAt } from "@/lib/blog-status";
import { prisma } from "@/lib/db";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { estimateReadMinutes } from "@/lib/reading-time";
import { can } from "@/lib/roles";
import { slugify } from "@/lib/slug";
import type { CreateBlogPostInput, UpdateBlogPostInput } from "@/lib/validation";

function assertCanManage(actorRole: unknown): void {
  if (!can(actorRole, "blog:manage")) {
    throw new AuthorizationError("You are not allowed to manage blog posts.");
  }
}

// Optional free-text/URL fields: an empty string clears the value, undefined leaves it untouched.
function cleanText(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value : null;
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;
  while (await prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function createBlogPost(args: {
  actorRole: unknown;
  authorId: string;
  data: CreateBlogPostInput;
}) {
  assertCanManage(args.actorRole);
  const slug = await uniqueSlug(args.data.title);
  const publishedAt = resolvePublishedAt(null, args.data.status, null, new Date());

  return prisma.blogPost.create({
    data: {
      title: args.data.title,
      slug,
      body: args.data.body,
      coverImage: cleanText(args.data.coverImage),
      category: args.data.category,
      metaTitle: cleanText(args.data.metaTitle),
      metaDescription: cleanText(args.data.metaDescription),
      ogImageUrl: cleanText(args.data.ogImageUrl),
      // Honour a manual override, otherwise estimate from the body.
      estimatedReadMinutes: args.data.estimatedReadMinutes ?? estimateReadMinutes(args.data.body),
      status: args.data.status,
      publishedAt,
      authorId: args.authorId,
    },
  });
}

export async function updateBlogPost(args: {
  actorRole: unknown;
  id: string;
  data: UpdateBlogPostInput;
}) {
  assertCanManage(args.actorRole);
  const existing = await prisma.blogPost.findUnique({
    where: { id: args.id },
    select: { id: true, status: true, publishedAt: true },
  });
  if (!existing) {
    throw new NotFoundError("Blog post not found.");
  }

  const nextStatus = args.data.status ?? existing.status;
  const publishedAt = resolvePublishedAt(
    existing.status,
    nextStatus,
    existing.publishedAt,
    new Date(),
  );

  const { coverImage, metaTitle, metaDescription, ogImageUrl, estimatedReadMinutes, body, ...rest } =
    args.data;

  // Recompute reading time when the body changes, unless an explicit override was given.
  const readMinutes =
    estimatedReadMinutes !== undefined
      ? estimatedReadMinutes
      : body !== undefined
        ? estimateReadMinutes(body)
        : undefined;

  return prisma.blogPost.update({
    where: { id: args.id },
    data: {
      ...rest, // title / category / status, only when provided
      ...(body !== undefined ? { body } : {}),
      ...(coverImage !== undefined ? { coverImage: cleanText(coverImage) } : {}),
      ...(metaTitle !== undefined ? { metaTitle: cleanText(metaTitle) } : {}),
      ...(metaDescription !== undefined ? { metaDescription: cleanText(metaDescription) } : {}),
      ...(ogImageUrl !== undefined ? { ogImageUrl: cleanText(ogImageUrl) } : {}),
      ...(readMinutes !== undefined ? { estimatedReadMinutes: readMinutes } : {}),
      publishedAt,
    },
  });
}

export async function deleteBlogPost(args: { actorRole: unknown; id: string }): Promise<void> {
  assertCanManage(args.actorRole);
  const existing = await prisma.blogPost.findUnique({
    where: { id: args.id },
    select: { id: true },
  });
  if (!existing) {
    throw new NotFoundError("Blog post not found.");
  }
  await prisma.blogPost.delete({ where: { id: args.id } });
}

// --- Public reads (unauthenticated) ---------------------------------------

export async function getPublicPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !isBlogPubliclyVisible(post.status)) {
    return null;
  }
  return post;
}

export async function listPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });
}

// Published posts in a single editorial category — backs the content hubs
// ("Farmland — Real or Hype?" and "Farming Guides / Knowledge Base").
export async function listPublishedPostsByCategory(category: string) {
  return prisma.blogPost.findMany({
    where: { status: "published", category },
    orderBy: { publishedAt: "desc" },
  });
}

// Contextual blog links for a listing/project detail page. Genuine district matches are
// preferred so the "Read before you decide" block feels relevant; general trust/guide
// posts only fill any remaining slots as a fallback.
//
// Note: on SQLite, Prisma `contains` is case-sensitive, so the district string should be
// stored/passed in the same casing used in post copy (e.g. "Idukki").
const RELATED_GUIDE_CATEGORIES = ["legal_guides", "nri_corner", "farming_guides"];

export async function listRelatedPostsForListing(args: { district: string; limit?: number }) {
  const take = args.limit ?? 2;
  const district = args.district.trim();

  const districtMatches = district
    ? await prisma.blogPost.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: district } },
            { body: { contains: district } },
            { metaDescription: { contains: district } },
          ],
        },
        orderBy: { publishedAt: "desc" },
        take,
      })
    : [];

  if (districtMatches.length >= take) {
    return districtMatches;
  }

  const seen = new Set(districtMatches.map((post) => post.id));
  const fallback = await prisma.blogPost.findMany({
    where: {
      status: "published",
      category: { in: RELATED_GUIDE_CATEGORIES },
      id: { notIn: [...seen] },
    },
    orderBy: { publishedAt: "desc" },
    take,
  });

  return [...districtMatches, ...fallback].slice(0, take);
}

// --- Admin reads ----------------------------------------------------------

export async function listAllPosts(args: { actorRole: unknown }) {
  assertCanManage(args.actorRole);
  return prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
}
