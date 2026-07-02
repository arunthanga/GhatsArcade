import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import { prisma, resetDb } from "../../tests/helpers/db";
import { createOwner } from "../../tests/helpers/factories";
import { addFollowUpNote, captureLead, getLead, listLeads, updateLeadStatus } from "./leads";
import { createListing } from "./listings";

let ownerId: string;

const inquiry = {
  name: "Asha",
  phone: "+919876543210",
  buyerType: "resident_indian" as const,
  leadType: "inquiry" as const,
  isCofarmer: false,
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
    expect(lead.phone).toBe("+919876543210");
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

  it("stores preferred call slot and timezone for scheduled calls", async () => {
    const lead = await captureLead({
      ...inquiry,
      leadType: "callback",
      preferredCallSlot: "morning",
      preferredTimezone: "Asia/Dubai",
    });

    expect(lead.preferredCallSlot).toBe("morning");
    expect(lead.preferredTimezone).toBe("Asia/Dubai");
  });
});

describe("captureLead deduplication", () => {
  it("merges a second enquiry from the same phone instead of creating a duplicate", async () => {
    const first = await captureLead({ ...inquiry, email: "", message: "First message." });
    const second = await captureLead({
      ...inquiry,
      email: "asha@example.com",
      message: "Second message.",
    });

    expect(second.id).toBe(first.id);
    expect(await prisma.lead.count()).toBe(1);
    // Missing contact detail is enriched, history is appended (never overwritten).
    expect(second.email).toBe("asha@example.com");
    expect(second.message).toContain("First message.");
    expect(second.message).toContain("Second message.");
    expect(second.message).toContain("Repeat enquiry");
  });

  it("caps the merged message history so repeat enquiries cannot grow it unbounded", async () => {
    const longMessage = "x".repeat(900);
    let lead = await captureLead({ ...inquiry, message: longMessage });
    for (let i = 0; i < 10; i += 1) {
      lead = await captureLead({ ...inquiry, message: `${longMessage} round ${i}` });
    }

    expect(lead.message).not.toBeNull();
    expect(lead.message?.length).toBeLessThanOrEqual(4000);
    // The most recent enquiry is retained; the oldest history is trimmed away.
    expect(lead.message).toContain("round 9");
    expect(lead.message).toContain("Earlier history trimmed");
  });

  it("keeps separate leads for different phone numbers", async () => {
    await captureLead(inquiry);
    await captureLead({ ...inquiry, phone: "+919999999999" });
    expect(await prisma.lead.count()).toBe(2);
  });

  it("deduplicates matching phone digits even when formatting differs", async () => {
    const first = await captureLead({ ...inquiry, phone: "+91 98765 43210" });
    const second = await captureLead({ ...inquiry, phone: "+919876543210" });

    expect(second.id).toBe(first.id);
    expect(await prisma.lead.count()).toBe(1);
  });

  it("does not clobber an existing lead's pipeline status", async () => {
    const first = await captureLead(inquiry);
    await updateLeadStatus({
      actorRole: "ADMIN",
      id: first.id,
      status: "contacted",
    });
    const merged = await captureLead({ ...inquiry, message: "Following up." });
    expect(merged.status).toBe("contacted");
  });

  it("enriches missing schedule-call fields during deduplication", async () => {
    const first = await captureLead(inquiry);
    const second = await captureLead({
      ...inquiry,
      leadType: "callback",
      preferredCallSlot: "evening",
      preferredTimezone: "Europe/London",
    });

    expect(second.id).toBe(first.id);
    expect(second.preferredCallSlot).toBe("evening");
    expect(second.preferredTimezone).toBe("Europe/London");
  });

  it("upgrades leadType when a higher-intent capture arrives from the same phone", async () => {
    const first = await captureLead({ ...inquiry, leadType: "callback" });
    const second = await captureLead({ ...inquiry, leadType: "inquiry" });

    expect(second.id).toBe(first.id);
    expect(second.leadType).toBe("inquiry");
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
    const updated = await updateLeadStatus({
      actorRole: "ADMIN",
      id: lead.id,
      status: "contacted",
    });
    expect(updated.status).toBe("contacted");
  });

  it("allows site_visit_requested after contact but not directly from new", async () => {
    const lead = await captureLead(inquiry);

    await expect(
      updateLeadStatus({
        actorRole: "ADMIN",
        id: lead.id,
        status: "site_visit_requested",
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    await updateLeadStatus({ actorRole: "ADMIN", id: lead.id, status: "contacted" });
    const requested = await updateLeadStatus({
      actorRole: "ADMIN",
      id: lead.id,
      status: "site_visit_requested",
    });
    expect(requested.status).toBe("site_visit_requested");
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
