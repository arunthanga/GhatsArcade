// Owner-only data export (prj.md Section 9). Gated server-side via can(role, "data:export")
// so Admins can never export. Builds predictable, fixed-column CSVs from Prisma using the
// pure serializer in src/lib/csv.ts.

import { type CsvColumn, toCsv } from "@/lib/csv";
import { prisma } from "@/lib/db";
import { AuthorizationError } from "@/lib/errors";
import { countAvailablePlots } from "@/lib/plot-status";
import { can } from "@/lib/roles";

export const EXPORT_DATASETS = ["leads", "listings", "projects", "events"] as const;
export type ExportDataset = (typeof EXPORT_DATASETS)[number];

export function isExportDataset(value: unknown): value is ExportDataset {
  return typeof value === "string" && (EXPORT_DATASETS as readonly string[]).includes(value);
}

const LEAD_COLUMNS: CsvColumn[] = [
  { key: "id", header: "id" },
  { key: "name", header: "name" },
  { key: "email", header: "email" },
  { key: "phone", header: "phone" },
  { key: "whatsapp", header: "whatsapp" },
  { key: "buyerType", header: "buyer_type" },
  { key: "leadType", header: "lead_type" },
  { key: "status", header: "status" },
  { key: "isCofarmer", header: "is_cofarmer" },
  { key: "projectInterest", header: "project_interest" },
  { key: "plotInterest", header: "plot_interest" },
  { key: "preferredDate", header: "preferred_date" },
  { key: "preferredCallSlot", header: "preferred_call_slot" },
  { key: "preferredTimezone", header: "preferred_timezone" },
  { key: "sourcePage", header: "source_page" },
  { key: "sourceListingTitle", header: "source_listing" },
  { key: "sourceProjectTitle", header: "source_project" },
  { key: "sourceBlogPostTitle", header: "source_blog_post" },
  { key: "createdAt", header: "created_at" },
];

const LISTING_COLUMNS: CsvColumn[] = [
  { key: "id", header: "id" },
  { key: "title", header: "title" },
  { key: "slug", header: "slug" },
  { key: "district", header: "district" },
  { key: "nearestTown", header: "nearest_town" },
  { key: "landType", header: "land_type" },
  { key: "sizeAcres", header: "size_acres" },
  { key: "priceInr", header: "price_inr" },
  { key: "status", header: "status" },
  { key: "createdAt", header: "created_at" },
];

async function leadRows(): Promise<Record<string, unknown>[]> {
  const leads = await prisma.lead.findMany({
    include: {
      sourceListing: { select: { title: true } },
      sourceProject: { select: { title: true } },
      sourceBlogPost: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    whatsapp: lead.whatsapp,
    buyerType: lead.buyerType,
    leadType: lead.leadType,
    status: lead.status,
    isCofarmer: lead.isCofarmer ? "yes" : "no",
    projectInterest: lead.projectInterest,
    plotInterest: lead.plotInterest,
    preferredDate: lead.preferredDate ? lead.preferredDate.toISOString().slice(0, 10) : "",
    preferredCallSlot: lead.preferredCallSlot ?? "",
    preferredTimezone: lead.preferredTimezone ?? "",
    sourcePage: lead.sourcePage,
    sourceListingTitle: lead.sourceListing?.title ?? "",
    sourceProjectTitle: lead.sourceProject?.title ?? "",
    sourceBlogPostTitle: lead.sourceBlogPost?.title ?? "",
    createdAt: lead.createdAt.toISOString(),
  }));
}

const PROJECT_COLUMNS: CsvColumn[] = [
  { key: "id", header: "id" },
  { key: "title", header: "title" },
  { key: "slug", header: "slug" },
  { key: "theme", header: "theme" },
  { key: "locationDistrict", header: "location_district" },
  { key: "locationNearestTown", header: "location_nearest_town" },
  { key: "keralaTnBorder", header: "kerala_tn_border" },
  { key: "totalAreaAcres", header: "total_area_acres" },
  { key: "landRevenueClassification", header: "land_revenue_classification" },
  { key: "roadStatus", header: "road_status" },
  { key: "status", header: "status" },
  { key: "totalPlots", header: "total_plots" },
  { key: "availablePlots", header: "available_plots" },
  { key: "startingPriceInr", header: "starting_price_inr" },
  { key: "createdAt", header: "created_at" },
];

async function projectRows(): Promise<Record<string, unknown>[]> {
  const projects = await prisma.project.findMany({
    include: { plots: { select: { status: true, totalPrice: true } } },
    orderBy: { createdAt: "desc" },
  });
  return projects.map((project) => {
    const prices = project.plots.map((plot) => plot.totalPrice);
    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      theme: project.theme ?? "",
      locationDistrict: project.locationDistrict,
      locationNearestTown: project.locationNearestTown ?? "",
      keralaTnBorder: project.keralaTnBorder ? "yes" : "no",
      totalAreaAcres: project.totalAreaAcres ?? "",
      landRevenueClassification: project.landRevenueClassification,
      roadStatus: project.roadStatus,
      status: project.status,
      totalPlots: project.plots.length,
      availablePlots: countAvailablePlots(project.plots),
      startingPriceInr: prices.length > 0 ? Math.min(...prices) : "",
      createdAt: project.createdAt.toISOString(),
    };
  });
}

const EVENT_COLUMNS: CsvColumn[] = [
  { key: "id", header: "id" },
  { key: "title", header: "title" },
  { key: "slug", header: "slug" },
  { key: "eventDate", header: "event_date" },
  { key: "status", header: "status" },
  { key: "theme", header: "theme" },
  { key: "projectTitle", header: "project" },
  { key: "photoCount", header: "photo_count" },
  { key: "createdAt", header: "created_at" },
];

async function eventRows(): Promise<Record<string, unknown>[]> {
  const events = await prisma.event.findMany({
    include: { project: { select: { title: true } }, _count: { select: { photos: true } } },
    orderBy: { eventDate: "desc" },
  });
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    eventDate: event.eventDate.toISOString().slice(0, 10),
    status: event.status,
    theme: event.theme ?? "",
    projectTitle: event.project?.title ?? "",
    photoCount: event._count.photos,
    createdAt: event.createdAt.toISOString(),
  }));
}

async function listingRows(): Promise<Record<string, unknown>[]> {
  const listings = await prisma.listing.findMany({ orderBy: { createdAt: "desc" } });
  return listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    slug: listing.slug,
    district: listing.district,
    nearestTown: listing.nearestTown,
    landType: listing.landType,
    sizeAcres: listing.sizeAcres,
    priceInr: listing.priceInr,
    status: listing.status,
    createdAt: listing.createdAt.toISOString(),
  }));
}

export async function exportCsv(args: {
  actorRole: unknown;
  dataset: ExportDataset;
}): Promise<{ filename: string; csv: string }> {
  if (!can(args.actorRole, "data:export")) {
    throw new AuthorizationError("Only the Owner can export data.");
  }

  const date = new Date().toISOString().slice(0, 10);
  if (args.dataset === "leads") {
    return { filename: `leads-${date}.csv`, csv: toCsv(await leadRows(), LEAD_COLUMNS) };
  }
  if (args.dataset === "projects") {
    return { filename: `projects-${date}.csv`, csv: toCsv(await projectRows(), PROJECT_COLUMNS) };
  }
  if (args.dataset === "events") {
    return { filename: `events-${date}.csv`, csv: toCsv(await eventRows(), EVENT_COLUMNS) };
  }
  return { filename: `listings-${date}.csv`, csv: toCsv(await listingRows(), LISTING_COLUMNS) };
}
