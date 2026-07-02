// Testimonial service layer (prj.md Section 3.1 Block 9 / Section 8). All writes funnel
// through here so the "testimonial:manage" role check runs server-side. Public reads return
// only active testimonials. Quotes are plain text (no HTML), so no sanitisation is needed.

import { prisma } from "@/lib/db";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { can } from "@/lib/roles";
import type { CreateTestimonialInput, UpdateTestimonialInput } from "@/lib/validation";

const TESTIMONIAL_INCLUDE = {
  project: { select: { slug: true, title: true } },
} as const;

function assertCanManage(actorRole: unknown): void {
  if (!can(actorRole, "testimonial:manage")) {
    throw new AuthorizationError("You are not allowed to manage testimonials.");
  }
}

// Empty strings from form inputs become null in the column.
function cleanText(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

// Resolve an optional project link, failing open to null if the id is unknown so a stale
// reference can never block saving a testimonial.
async function resolveProjectId(projectId: string | undefined): Promise<string | null> {
  if (!projectId) {
    return null;
  }
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });
  return project?.id ?? null;
}

// --- Writes ---------------------------------------------------------------

export async function createTestimonial(args: {
  actorRole: unknown;
  createdById: string;
  data: CreateTestimonialInput;
}) {
  assertCanManage(args.actorRole);
  const { buyerCity, videoUrl, projectId, ...rest } = args.data;

  return prisma.testimonial.create({
    data: {
      ...rest,
      buyerCity: cleanText(buyerCity),
      videoUrl: cleanText(videoUrl),
      projectId: await resolveProjectId(projectId),
      createdById: args.createdById,
    },
    include: TESTIMONIAL_INCLUDE,
  });
}

export async function updateTestimonial(args: {
  actorRole: unknown;
  id: string;
  data: UpdateTestimonialInput;
}) {
  assertCanManage(args.actorRole);
  const existing = await prisma.testimonial.findUnique({
    where: { id: args.id },
    select: { id: true },
  });
  if (!existing) {
    throw new NotFoundError("Testimonial not found.");
  }

  const { buyerCity, videoUrl, projectId, ...rest } = args.data;

  return prisma.testimonial.update({
    where: { id: args.id },
    data: {
      ...rest,
      ...(buyerCity !== undefined ? { buyerCity: cleanText(buyerCity) } : {}),
      ...(videoUrl !== undefined ? { videoUrl: cleanText(videoUrl) } : {}),
      ...(projectId !== undefined ? { projectId: await resolveProjectId(projectId) } : {}),
    },
    include: TESTIMONIAL_INCLUDE,
  });
}

export async function deleteTestimonial(args: { actorRole: unknown; id: string }): Promise<void> {
  assertCanManage(args.actorRole);
  const existing = await prisma.testimonial.findUnique({
    where: { id: args.id },
    select: { id: true },
  });
  if (!existing) {
    throw new NotFoundError("Testimonial not found.");
  }
  await prisma.testimonial.delete({ where: { id: args.id } });
}

// --- Public reads (unauthenticated) ---------------------------------------

// Active testimonials, in the admin-chosen display order (then newest first).
export async function listActiveTestimonials() {
  return prisma.testimonial.findMany({
    where: { isActive: true },
    include: TESTIMONIAL_INCLUDE,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
}

// --- Admin reads ----------------------------------------------------------

export async function listAllTestimonials(args: { actorRole: unknown }) {
  assertCanManage(args.actorRole);
  return prisma.testimonial.findMany({
    include: TESTIMONIAL_INCLUDE,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
}
