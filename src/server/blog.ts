// Blog / CMS service layer (prj.md Section 3). All writes funnel through here so role
// checks (src/lib/roles.ts) are enforced server-side. Public reads are unauthenticated
// but restricted to published posts via src/lib/blog-status.ts.

import { isBlogPubliclyVisible, resolvePublishedAt } from "@/lib/blog-status";
import { prisma } from "@/lib/db";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { can } from "@/lib/roles";
import { slugify } from "@/lib/slug";
import type { CreateBlogPostInput, UpdateBlogPostInput } from "@/lib/validation";

function assertCanManage(actorRole: unknown): void {
  if (!can(actorRole, "blog:manage")) {
    throw new AuthorizationError("You are not allowed to manage blog posts.");
  }
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
      coverImage: args.data.coverImage ?? null,
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

  const { coverImage, ...rest } = args.data;
  return prisma.blogPost.update({
    where: { id: args.id },
    data: {
      ...rest,
      ...(coverImage !== undefined ? { coverImage: coverImage ?? null } : {}),
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

// --- Admin reads ----------------------------------------------------------

export async function listAllPosts(args: { actorRole: unknown }) {
  assertCanManage(args.actorRole);
  return prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
}
