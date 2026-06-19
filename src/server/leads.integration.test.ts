import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import { prisma, resetDb } from "../../tests/helpers/db";
import { createOwner } from "../../tests/helpers/factories";
import { createListing } from "./listings";
import {
  addFollowUpNote,
  captureLead,
  getLead,
  listLeads,
  updateLeadStatus,
} from "./leads";

let ownerId: string;

const inquiry = {
  name: "Asha",
  phone: "+919876543210",
  buyerType: "resident_indian" as const,
  email: "",
  message: "Interested in this plot.",
};

beforeEach(async () => {
  await resetDb();
  const owner = await createOwner();
  ownerId = owner.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("captureLead", () => {
  it("creates a lead with status new (no source listing)", async () => {
    const lead = await captureLead(inquiry);
    expect(lead.status).toBe("new");
    expect(lead.sourceListingId).toBeNull();
    expect(lead.email).toBeNull();
  });

  it("links a valid source listing", async () => {
    const listing = await createListing({
      actorRole: "OWNER",
      createdById: ownerId,
      data: {
        title: "Linked Plot",
        description: "x",
        district: "Idukki",
        landType: "agricultural",
        sizeAcres: 2,
        priceInr: 1_000_000,
        keralaTnBorder: false,
        status: "published",
      },
    });
    const lead = await captureLead({ ...inquiry, sourceListingId: listing.id });
    expect(lead.sourceListingId).toBe(listing.id);
  });

  it("stores a null source when the listing id does not exist", async () => {
    const lead = await captureLead({ ...inquiry, sourceListingId: "missing-id" });
    expect(lead.sourceListingId).toBeNull();
  });
});

describe("listLeads / getLead", () => {
  it("denies unknown roles and allows an Admin", async () => {
    await captureLead(inquiry);
    await expect(listLeads({ actorRole: "guest" })).rejects.toBeInstanceOf(AuthorizationError);
    expect(await listLeads({ actorRole: "ADMIN" })).toHaveLength(1);
  });

  it("getLead throws NotFoundError for a missing id", async () => {
    await expect(getLead({ actorRole: "OWNER", id: "nope" })).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("updateLeadStatus", () => {
  it("allows a legal transition", async () => {
    const lead = await captureLead(inquiry);
    const updated = await updateLeadStatus({ actorRole: "ADMIN", id: lead.id, status: "contacted" });
    expect(updated.status).toBe("contacted");
  });

  it("rejects an illegal jump", async () => {
    const lead = await captureLead(inquiry);
    await expect(
      updateLeadStatus({ actorRole: "ADMIN", id: lead.id, status: "converted" }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("denies unknown roles", async () => {
    const lead = await captureLead(inquiry);
    await expect(
      updateLeadStatus({ actorRole: "guest", id: lead.id, status: "contacted" }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});

describe("addFollowUpNote", () => {
  it("records a note with its author", async () => {
    const lead = await captureLead(inquiry);
    const note = await addFollowUpNote({
      actorRole: "ADMIN",
      authorId: ownerId,
      leadId: lead.id,
      noteText: "Called, visiting Saturday.",
      contactMethod: "call",
    });
    expect(note.authorId).toBe(ownerId);

    const withNotes = await getLead({ actorRole: "OWNER", id: lead.id });
    expect(withNotes.followUpNotes).toHaveLength(1);
    expect(withNotes.followUpNotes[0]?.author.name).toBeTruthy();
  });

  it("throws NotFoundError for a missing lead and denies unknown roles", async () => {
    await expect(
      addFollowUpNote({
        actorRole: "ADMIN",
        authorId: ownerId,
        leadId: "missing",
        noteText: "x",
        contactMethod: "call",
      }),
    ).rejects.toBeInstanceOf(NotFoundError);

    const lead = await captureLead(inquiry);
    await expect(
      addFollowUpNote({
        actorRole: "guest",
        authorId: ownerId,
        leadId: lead.id,
        noteText: "x",
        contactMethod: "call",
      }),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});
