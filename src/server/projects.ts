// Project + Plot service layer (prj.md Section 3.3 / 8). All writes funnel through here
// so role checks (src/lib/roles.ts) run server-side. Public reads are unauthenticated
// but restricted to publicly-visible statuses via src/lib/project-status.ts.
//
// Projects are the central entity: Plots, Leads, Events, Testimonials, and Horticulture
// logs all hang off them.

import { prisma } from "@/lib/db";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import {
  canTransitionProjectStatus,
  isProjectPubliclyVisible,
  PUBLIC_PROJECT_STATUSES,
} from "@/lib/project-status";
import { can } from "@/lib/roles";
import { sanitizeRichText } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";
import type {
  CreatePlotInput,
  CreateProjectInput,
  ProjectFilter,
  ProjectPhotoInput,
  UpdatePlotInput,
  UpdateProjectInput,
} from "@/lib/validation";

const PROJECT_DETAIL_INCLUDE = {
  photos: { orderBy: { sortOrder: "asc" } },
  plots: { orderBy: { plotNumber: "asc" } },
} as const;

const PROJECT_LIST_INCLUDE = {
  photos: { orderBy: { sortOrder: "asc" } },
  plots: { select: { status: true, pricePerCent: true } },
} as const;

function assertCanManage(actorRole: unknown): void {
  if (!can(actorRole, "project:manage")) {
    throw new AuthorizationError("You are not allowed to manage projects.");
  }
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;
  while (await prisma.project.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function photoCreateData(photos: ProjectPhotoInput[] | undefined) {
  if (!photos || photos.length === 0) {
    return undefined;
  }
  return {
    create: photos.map((photo, index) => ({
      url: photo.url,
      alt: photo.alt ?? null,
      tag: photo.tag ?? null,
      sortOrder: photo.sortOrder ?? index,
    })),
  };
}

// --- Project writes -------------------------------------------------------

export async function createProject(args: {
  actorRole: unknown;
  createdById: string;
  data: CreateProjectInput;
}) {
  assertCanManage(args.actorRole);
  const { photos, description, ...rest } = args.data;
  const slug = await uniqueSlug(rest.title);

  return prisma.project.create({
    data: {
      ...rest,
      description: sanitizeRichText(description),
      slug,
      createdById: args.createdById,
      photos: photoCreateData(photos),
    },
    include: PROJECT_DETAIL_INCLUDE,
  });
}

export async function updateProject(args: {
  actorRole: unknown;
  id: string;
  data: UpdateProjectInput;
}) {
  assertCanManage(args.actorRole);

  const existing = await prisma.project.findUnique({
    where: { id: args.id },
    select: { id: true, status: true },
  });
  if (!existing) {
    throw new NotFoundError("Project not found.");
  }

  const { photos, status, description, ...rest } = args.data;

  if (status && !canTransitionProjectStatus(existing.status, status)) {
    throw new ValidationError(`Cannot change status from ${existing.status} to ${status}.`);
  }

  if (photos) {
    await prisma.projectPhoto.deleteMany({ where: { projectId: args.id } });
  }

  return prisma.project.update({
    where: { id: args.id },
    data: {
      ...rest,
      ...(status ? { status } : {}),
      ...(description !== undefined ? { description: sanitizeRichText(description) } : {}),
      ...(photos ? { photos: photoCreateData(photos) } : {}),
    },
    include: PROJECT_DETAIL_INCLUDE,
  });
}

export async function deleteProject(args: { actorRole: unknown; id: string }): Promise<void> {
  assertCanManage(args.actorRole);
  const existing = await prisma.project.findUnique({
    where: { id: args.id },
    select: { id: true },
  });
  if (!existing) {
    throw new NotFoundError("Project not found.");
  }
  await prisma.project.delete({ where: { id: args.id } });
}

// --- Public reads (unauthenticated) ---------------------------------------

export async function getPublicProjectBySlug(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: PROJECT_DETAIL_INCLUDE,
  });
  if (!project || !isProjectPubliclyVisible(project.status)) {
    return null;
  }
  return project;
}

export async function listPublicProjects(filters: ProjectFilter = {}) {
  // Only allow filtering to a status that is itself public.
  const statusFilter =
    filters.status && (PUBLIC_PROJECT_STATUSES as readonly string[]).includes(filters.status)
      ? filters.status
      : undefined;

  const plotPriceRange =
    filters.minPricePerCent !== undefined || filters.maxPricePerCent !== undefined
      ? {
          ...(filters.minPricePerCent !== undefined ? { gte: filters.minPricePerCent } : {}),
          ...(filters.maxPricePerCent !== undefined ? { lte: filters.maxPricePerCent } : {}),
        }
      : undefined;

  const plotSizeRange =
    filters.minCents !== undefined || filters.maxCents !== undefined
      ? {
          ...(filters.minCents !== undefined ? { gte: filters.minCents } : {}),
          ...(filters.maxCents !== undefined ? { lte: filters.maxCents } : {}),
        }
      : undefined;

  return prisma.project.findMany({
    where: {
      status: statusFilter ? statusFilter : { in: [...PUBLIC_PROJECT_STATUSES] },
      ...(filters.district ? { locationDistrict: filters.district } : {}),
      ...(plotPriceRange || plotSizeRange
        ? {
            plots: {
              some: {
                ...(plotPriceRange ? { pricePerCent: plotPriceRange } : {}),
                ...(plotSizeRange ? { sizeCents: plotSizeRange } : {}),
              },
            },
          }
        : {}),
    },
    include: PROJECT_LIST_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

// --- Admin reads ----------------------------------------------------------

export async function listAllProjects(args: { actorRole: unknown }) {
  assertCanManage(args.actorRole);
  return prisma.project.findMany({
    include: PROJECT_LIST_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectForAdmin(args: { actorRole: unknown; id: string }) {
  assertCanManage(args.actorRole);
  const project = await prisma.project.findUnique({
    where: { id: args.id },
    include: PROJECT_DETAIL_INCLUDE,
  });
  if (!project) {
    throw new NotFoundError("Project not found.");
  }
  return project;
}

// --- Plot writes ----------------------------------------------------------

function resolveTotalPrice(input: {
  sizeCents: number;
  pricePerCent: number;
  totalPrice?: number;
}) {
  return input.totalPrice ?? Math.round(input.sizeCents * input.pricePerCent);
}

export async function createPlot(args: {
  actorRole: unknown;
  projectId: string;
  data: CreatePlotInput;
}) {
  assertCanManage(args.actorRole);
  const project = await prisma.project.findUnique({
    where: { id: args.projectId },
    select: { id: true },
  });
  if (!project) {
    throw new NotFoundError("Project not found.");
  }

  const { totalPrice: _ignored, ...rest } = args.data;
  return prisma.plot.create({
    data: {
      ...rest,
      totalPrice: resolveTotalPrice(args.data),
      projectId: args.projectId,
    },
  });
}

export async function updatePlot(args: { actorRole: unknown; id: string; data: UpdatePlotInput }) {
  assertCanManage(args.actorRole);
  const existing = await prisma.plot.findUnique({
    where: { id: args.id },
    select: { id: true, sizeCents: true, pricePerCent: true },
  });
  if (!existing) {
    throw new NotFoundError("Plot not found.");
  }

  const { totalPrice, ...rest } = args.data;
  // Recompute total price if size/price changed and an explicit total wasn't given.
  const sizeCents = rest.sizeCents ?? existing.sizeCents;
  const pricePerCent = rest.pricePerCent ?? existing.pricePerCent;
  const nextTotal =
    totalPrice ??
    (rest.sizeCents !== undefined || rest.pricePerCent !== undefined
      ? Math.round(sizeCents * pricePerCent)
      : undefined);

  return prisma.plot.update({
    where: { id: args.id },
    data: {
      ...rest,
      ...(nextTotal !== undefined ? { totalPrice: nextTotal } : {}),
    },
  });
}

export async function deletePlot(args: { actorRole: unknown; id: string }): Promise<void> {
  assertCanManage(args.actorRole);
  const existing = await prisma.plot.findUnique({
    where: { id: args.id },
    select: { id: true },
  });
  if (!existing) {
    throw new NotFoundError("Plot not found.");
  }
  await prisma.plot.delete({ where: { id: args.id } });
}
