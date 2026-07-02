// Event service layer (prj.md Section 3 / 8). All writes funnel through here so role
// checks (src/lib/roles.ts, "event:manage") run server-side. Public reads are
// unauthenticated but restricted to publicly-visible statuses via src/lib/event-status.ts.

import { prisma } from "@/lib/db";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { isEventPubliclyVisible } from "@/lib/event-status";
import { can } from "@/lib/roles";
import { sanitizeRichText } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";
import type { CreateEventInput, EventPhotoInput, UpdateEventInput } from "@/lib/validation";

const EVENT_INCLUDE = {
  photos: { orderBy: { sortOrder: "asc" } },
  project: { select: { slug: true, title: true } },
} as const;

function assertCanManage(actorRole: unknown): void {
  if (!can(actorRole, "event:manage")) {
    throw new AuthorizationError("You are not allowed to manage events.");
  }
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;
  while (await prisma.event.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function photoCreateData(photos: EventPhotoInput[] | undefined) {
  if (!photos || photos.length === 0) {
    return undefined;
  }
  return {
    create: photos.map((photo, index) => ({
      url: photo.url,
      alt: photo.alt ?? null,
      sortOrder: photo.sortOrder ?? index,
    })),
  };
}

// Resolve an optional project link, failing open to null if the id is unknown so a stale
// reference can never block saving an event.
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

export async function createEvent(args: {
  actorRole: unknown;
  createdById: string;
  data: CreateEventInput;
}) {
  assertCanManage(args.actorRole);
  const { photos, description, projectId, ...rest } = args.data;
  const slug = await uniqueSlug(rest.title);

  return prisma.event.create({
    data: {
      ...rest,
      description: sanitizeRichText(description),
      slug,
      projectId: await resolveProjectId(projectId),
      createdById: args.createdById,
      photos: photoCreateData(photos),
    },
    include: EVENT_INCLUDE,
  });
}

export async function updateEvent(args: {
  actorRole: unknown;
  id: string;
  data: UpdateEventInput;
}) {
  assertCanManage(args.actorRole);
  const existing = await prisma.event.findUnique({
    where: { id: args.id },
    select: { id: true },
  });
  if (!existing) {
    throw new NotFoundError("Event not found.");
  }

  const { photos, description, projectId, ...rest } = args.data;

  if (photos) {
    await prisma.eventPhoto.deleteMany({ where: { eventId: args.id } });
  }

  return prisma.event.update({
    where: { id: args.id },
    data: {
      ...rest,
      ...(description !== undefined ? { description: sanitizeRichText(description) } : {}),
      ...(projectId !== undefined ? { projectId: await resolveProjectId(projectId) } : {}),
      ...(photos ? { photos: photoCreateData(photos) } : {}),
    },
    include: EVENT_INCLUDE,
  });
}

export async function deleteEvent(args: { actorRole: unknown; id: string }): Promise<void> {
  assertCanManage(args.actorRole);
  const existing = await prisma.event.findUnique({ where: { id: args.id }, select: { id: true } });
  if (!existing) {
    throw new NotFoundError("Event not found.");
  }
  await prisma.event.delete({ where: { id: args.id } });
}

// --- Public reads (unauthenticated) ---------------------------------------

export async function getPublicEventBySlug(slug: string) {
  const event = await prisma.event.findUnique({ where: { slug }, include: EVENT_INCLUDE });
  if (!event || !isEventPubliclyVisible(event.status)) {
    return null;
  }
  return event;
}

// All publicly-visible events, newest first. The public page groups these into
// upcoming (date ascending) and past (date descending).
export async function listPublicEvents() {
  return prisma.event.findMany({
    where: { status: { in: ["upcoming", "past"] } },
    include: EVENT_INCLUDE,
    orderBy: { eventDate: "desc" },
  });
}

// --- Admin reads ----------------------------------------------------------

export async function listAllEvents(args: { actorRole: unknown }) {
  assertCanManage(args.actorRole);
  return prisma.event.findMany({ include: EVENT_INCLUDE, orderBy: { eventDate: "desc" } });
}
