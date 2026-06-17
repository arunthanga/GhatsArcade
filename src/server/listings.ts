// Listing service layer (prj.md Section 3). All listing writes funnel through here so
// role checks (src/lib/roles.ts) are enforced server-side, never only in the UI.
// Public reads are intentionally unauthenticated but restricted to publicly-visible
// statuses via src/lib/listing-status.ts.

import { prisma } from "@/lib/db";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import {
  canTransitionStatus,
  isPubliclyVisible,
  PUBLIC_LISTING_STATUSES,
} from "@/lib/listing-status";
import { can } from "@/lib/roles";
import { slugify } from "@/lib/slug";
import type {
  CreateListingInput,
  ListingFilter,
  ListingPhotoInput,
  UpdateListingInput,
} from "@/lib/validation";

const LISTING_INCLUDE = {
  photos: { orderBy: { sortOrder: "asc" } },
} as const;

function assertCanManage(actorRole: unknown): void {
  if (!can(actorRole, "listing:manage")) {
    throw new AuthorizationError("You are not allowed to manage listings.");
  }
}

// Find a slug derived from `title` that is not yet taken, appending -2, -3, ...
async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;
  while (await prisma.listing.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function photoCreateData(photos: ListingPhotoInput[] | undefined) {
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

export async function createListing(args: {
  actorRole: unknown;
  createdById: string;
  data: CreateListingInput;
}) {
  assertCanManage(args.actorRole);
  const { photos, ...rest } = args.data;
  const slug = await uniqueSlug(rest.title);

  return prisma.listing.create({
    data: {
      ...rest,
      slug,
      createdById: args.createdById,
      photos: photoCreateData(photos),
    },
    include: LISTING_INCLUDE,
  });
}

export async function updateListing(args: {
  actorRole: unknown;
  id: string;
  data: UpdateListingInput;
}) {
  assertCanManage(args.actorRole);

  const existing = await prisma.listing.findUnique({
    where: { id: args.id },
    select: { id: true, status: true },
  });
  if (!existing) {
    throw new NotFoundError("Listing not found.");
  }

  const { photos, status, ...rest } = args.data;

  if (status && !canTransitionStatus(existing.status, status)) {
    throw new ValidationError(`Cannot change status from ${existing.status} to ${status}.`);
  }

  // Replace the photo set when the caller provides one.
  if (photos) {
    await prisma.listingPhoto.deleteMany({ where: { listingId: args.id } });
  }

  return prisma.listing.update({
    where: { id: args.id },
    data: {
      ...rest,
      ...(status ? { status } : {}),
      ...(photos ? { photos: photoCreateData(photos) } : {}),
    },
    include: LISTING_INCLUDE,
  });
}

export async function deleteListing(args: { actorRole: unknown; id: string }): Promise<void> {
  assertCanManage(args.actorRole);
  const existing = await prisma.listing.findUnique({
    where: { id: args.id },
    select: { id: true },
  });
  if (!existing) {
    throw new NotFoundError("Listing not found.");
  }
  await prisma.listing.delete({ where: { id: args.id } });
}

// --- Public reads (unauthenticated) ---------------------------------------

export async function getPublicListingBySlug(slug: string) {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: LISTING_INCLUDE,
  });
  if (!listing || !isPubliclyVisible(listing.status)) {
    return null;
  }
  return listing;
}

export async function listPublicListings(filters: ListingFilter = {}) {
  return prisma.listing.findMany({
    where: {
      status: { in: [...PUBLIC_LISTING_STATUSES] },
      ...(filters.district ? { district: filters.district } : {}),
      ...(filters.landType ? { landType: filters.landType } : {}),
      ...(filters.keralaTnBorder !== undefined
        ? { keralaTnBorder: filters.keralaTnBorder }
        : {}),
      ...(filters.minPriceInr !== undefined || filters.maxPriceInr !== undefined
        ? {
            priceInr: {
              ...(filters.minPriceInr !== undefined ? { gte: filters.minPriceInr } : {}),
              ...(filters.maxPriceInr !== undefined ? { lte: filters.maxPriceInr } : {}),
            },
          }
        : {}),
      ...(filters.minAcres !== undefined || filters.maxAcres !== undefined
        ? {
            sizeAcres: {
              ...(filters.minAcres !== undefined ? { gte: filters.minAcres } : {}),
              ...(filters.maxAcres !== undefined ? { lte: filters.maxAcres } : {}),
            },
          }
        : {}),
    },
    include: LISTING_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

// --- Admin reads ----------------------------------------------------------

export async function listAllListings(args: { actorRole: unknown }) {
  assertCanManage(args.actorRole);
  return prisma.listing.findMany({
    include: LISTING_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}
