import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { AuthorizationError } from "@/lib/errors";
import { prisma, resetDb } from "../../tests/helpers/db";
import { createOwner } from "../../tests/helpers/factories";
import { createEvent } from "./events";
import { exportCsv } from "./export";
import { captureLead } from "./leads";
import { createListing } from "./listings";
import { createPlot, createProject } from "./projects";

const PROJECT_HEADER =
  "id,title,slug,theme,location_district,location_nearest_town,kerala_tn_border,total_area_acres,land_revenue_classification,road_status,status,total_plots,available_plots,starting_price_inr,created_at";

const EVENT_HEADER = "id,title,slug,event_date,status,theme,project,photo_count,created_at";

let ownerId: string;

const LEAD_HEADER =
  "id,name,email,phone,whatsapp,buyer_type,lead_type,status,is_cofarmer,project_interest,plot_interest,preferred_date,preferred_call_slot,preferred_timezone,source_page,source_listing,source_project,source_blog_post,created_at";

beforeEach(async () => {
  await resetDb();
  const owner = await createOwner();
  ownerId = owner.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("exportCsv - authorization", () => {
  it("denies an Admin and an unknown role", async () => {
    await expect(exportCsv({ actorRole: "ADMIN", dataset: "leads" })).rejects.toBeInstanceOf(
      AuthorizationError,
    );
    await expect(exportCsv({ actorRole: "guest", dataset: "listings" })).rejects.toBeInstanceOf(
      AuthorizationError,
    );
  });
});

describe("exportCsv - leads", () => {
  it("exports a header plus a row with the resolved source listing", async () => {
    const listing = await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: {
        title: "Source Plot",
        description: "x",
        district: "Idukki",
        landType: "agricultural",
        sizeAcres: 3,
        priceInr: 2_000_000,
        keralaTnBorder: false,
        status: "published",
      },
    });
    await captureLead({
      name: "Asha",
      phone: "+919876543210",
      buyerType: "resident_indian",
      leadType: "inquiry",
      isCofarmer: false,
      email: "",
      message: "hi",
      sourceListingId: listing.id,
    });

    const { filename, csv } = await exportCsv({ actorRole: "OWNER", dataset: "leads" });
    const lines = csv.split("\r\n");
    expect(filename).toMatch(/^leads-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(lines[0]).toBe(LEAD_HEADER);
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("Asha");
    expect(lines[1]).toContain("Source Plot");
  });

  it("returns a header-only CSV when there are no leads", async () => {
    const { csv } = await exportCsv({ actorRole: "OWNER", dataset: "leads" });
    expect(csv).toBe(LEAD_HEADER);
  });
});

describe("exportCsv - listings", () => {
  it("exports listings with the fixed column header", async () => {
    await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: {
        title: "Plot A",
        description: "x",
        district: "Wayanad",
        landType: "agricultural",
        sizeAcres: 4,
        priceInr: 5_000_000,
        keralaTnBorder: true,
        status: "draft",
      },
    });

    const { csv } = await exportCsv({ actorRole: "OWNER", dataset: "listings" });
    const lines = csv.split("\r\n");
    expect(lines[0]).toBe(
      "id,title,slug,district,nearest_town,land_type,size_acres,price_inr,status,created_at",
    );
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("Plot A");
  });
});

describe("exportCsv - projects", () => {
  it("exports a header plus a row with plot counts and starting price", async () => {
    const project = await createProject({
      actorRole: "OWNER",
      createdById: ownerId,
      data: {
        title: "Cardamom Ridge",
        description: "A managed farmland estate.",
        locationDistrict: "Idukki",
        locationNearestTown: "Kattappana",
        keralaTnBorder: true,
        landRevenueClassification: "purayidam",
        roadStatus: "in_progress",
        commonAssetHandoverStatus: "owner_held",
        roadHandoverToPanchayatStatus: "not_initiated",
        status: "published",
        totalAreaAcres: 12,
      },
    });
    await createPlot({
      actorRole: "OWNER",
      projectId: project.id,
      data: { plotNumber: "A1", sizeCents: 10, pricePerCent: 50_000, status: "available" },
    });
    await createPlot({
      actorRole: "OWNER",
      projectId: project.id,
      data: { plotNumber: "A2", sizeCents: 8, pricePerCent: 40_000, status: "sold" },
    });

    const { filename, csv } = await exportCsv({ actorRole: "OWNER", dataset: "projects" });
    const lines = csv.split("\r\n");
    expect(filename).toMatch(/^projects-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(lines[0]).toBe(PROJECT_HEADER);
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("Cardamom Ridge");
    // total_plots=2, available_plots=1, starting_price = min(10*50000, 8*40000) = 320000
    expect(lines[1]).toContain(",2,1,320000,");
  });

  it("returns a header-only CSV when there are no projects", async () => {
    const { csv } = await exportCsv({ actorRole: "OWNER", dataset: "projects" });
    expect(csv).toBe(PROJECT_HEADER);
  });
});

describe("exportCsv - events", () => {
  it("exports a header plus a row with the resolved project title", async () => {
    const project = await createProject({
      actorRole: "OWNER",
      createdById: ownerId,
      data: {
        title: "Cardamom Ridge",
        description: "x",
        locationDistrict: "Idukki",
        keralaTnBorder: false,
        landRevenueClassification: "purayidam",
        roadStatus: "planned",
        commonAssetHandoverStatus: "owner_held",
        roadHandoverToPanchayatStatus: "not_initiated",
        status: "published",
      },
    });
    await createEvent({
      actorRole: "OWNER",
      createdById: ownerId,
      data: {
        title: "Harvest Open Day",
        description: "Join us for the harvest.",
        eventDate: new Date("2026-03-15T00:00:00.000Z"),
        status: "upcoming",
        projectId: project.id,
      },
    });

    const { filename, csv } = await exportCsv({ actorRole: "OWNER", dataset: "events" });
    const lines = csv.split("\r\n");
    expect(filename).toMatch(/^events-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(lines[0]).toBe(EVENT_HEADER);
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("Harvest Open Day");
    expect(lines[1]).toContain("2026-03-15");
    expect(lines[1]).toContain("Cardamom Ridge");
  });

  it("returns a header-only CSV when there are no events", async () => {
    const { csv } = await exportCsv({ actorRole: "OWNER", dataset: "events" });
    expect(csv).toBe(EVENT_HEADER);
  });
});
