// Lead capture + CRM service layer (prj.md Section 3). Public capture is open;
// status updates and follow-up notes require an authenticated Owner/Admin. All writes
// funnel through here so role checks (src/lib/roles.ts) and the status pipeline
// (src/lib/lead-status.ts) are enforced server-side, never only in the UI.

import { prisma } from "@/lib/db";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import { canTransitionLeadStatus } from "@/lib/lead-status";
import { can } from "@/lib/roles";
import { normalizePhone } from "@/lib/whatsapp";
import type { ContactMethod, LeadStatus, LeadType } from "@/types";
import type { LeadInquiryInput } from "@/lib/validation";

const LEAD_INCLUDE = {
  sourceListing: { select: { id: true, title: true, slug: true } },
  sourceProject: { select: { id: true, title: true, slug: true } },
  sourceBlogPost: { select: { id: true, title: true, slug: true } },
  followUpNotes: {
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true } } },
  },
} as const;

function assertCanView(actorRole: unknown): void {
  if (!can(actorRole, "lead:view")) {
    throw new AuthorizationError("You are not allowed to view leads.");
  }
}

function assertCanUpdate(actorRole: unknown): void {
  if (!can(actorRole, "lead:update")) {
    throw new AuthorizationError("You are not allowed to update leads.");
  }
}

// Resolve a foreign-key reference, fail-open to null: a stale/spoofed id must never
// block a genuine inquiry from being captured.
async function resolveRef(
  id: string | undefined,
  exists: (id: string) => Promise<{ id: string } | null>,
): Promise<string | null> {
  if (!id) {
    return null;
  }
  return (await exists(id))?.id ?? null;
}

// Canonical storage form: +{digits}. Makes dedup lookups index-friendly going forward.
function canonicalPhone(phone: string): string {
  const digits = normalizePhone(phone);
  return digits.length > 0 ? `+${digits}` : phone.trim();
}

// Higher-intent capture surfaces win when the same phone submits again.
const LEAD_TYPE_RANK: Record<LeadType, number> = {
  inquiry: 0,
  site_visit_request: 1,
  callback: 2,
  lead_magnet_download: 3,
};

function preferredLeadType(existing: string, incoming: LeadType): LeadType {
  const existingRank = LEAD_TYPE_RANK[existing as LeadType] ?? 99;
  const incomingRank = LEAD_TYPE_RANK[incoming] ?? 99;
  return incomingRank < existingRank ? incoming : (existing as LeadType);
}

// Build the merged `message` when a repeat enquiry arrives from a known phone.
// The new enquiry is appended (never overwrites history) and tagged so the CRM
// can see it was a follow-up rather than the original.
function mergeMessage(existing: string | null, incoming: string | null): string | null {
  const stamp = new Date().toISOString().slice(0, 10);
  const addition = `[Repeat enquiry ${stamp}]${incoming ? ` ${incoming}` : ""}`;
  return existing ? `${existing}\n${addition}` : addition;
}

async function findExistingLeadByPhone(phone: string) {
  const digits = normalizePhone(phone);
  if (!digits) {
    return null;
  }

  const canonical = canonicalPhone(phone);
  const exact = await prisma.lead.findFirst({
    where: { OR: [{ phone }, { phone: canonical }] },
    orderBy: { createdAt: "desc" },
  });
  if (exact) {
    return exact;
  }

  // Legacy rows with spaced/hyphenated numbers: narrow by suffix instead of scanning
  // the whole table (review fix — the prior implementation loaded every lead).
  const suffix = digits.slice(-10);
  if (suffix.length < 10) {
    return null;
  }

  const candidates = await prisma.lead.findMany({
    where: { phone: { contains: suffix } },
    orderBy: { createdAt: "desc" },
    take: 25,
  });
  return candidates.find((lead) => normalizePhone(lead.phone) === digits) ?? null;
}

// Public, unauthenticated. Source references that do not resolve are stored as null
// rather than rejected. `leadType` records which capture surface the lead used.
//
// Deduplication: a second enquiry from a phone number we already hold is merged into
// the existing lead (enriching any missing contact details and appending the new
// message) rather than creating a duplicate CRM record.
export async function captureLead(data: LeadInquiryInput) {
  const [sourceListingId, sourceProjectId, sourceBlogPostId] = await Promise.all([
    resolveRef(data.sourceListingId, (id) =>
      prisma.listing.findUnique({ where: { id }, select: { id: true } }),
    ),
    resolveRef(data.sourceProjectId, (id) =>
      prisma.project.findUnique({ where: { id }, select: { id: true } }),
    ),
    resolveRef(data.sourceBlogPostId, (id) =>
      prisma.blogPost.findUnique({ where: { id }, select: { id: true } }),
    ),
  ]);

  const existing = await findExistingLeadByPhone(data.phone);

  if (existing) {
    return prisma.lead.update({
      where: { id: existing.id },
      data: {
        // Enrich only fields we did not already have — never clobber CRM data.
        name: existing.name.trim().length > 0 ? existing.name : data.name,
        email: existing.email ?? (data.email ? data.email : null),
        whatsapp: existing.whatsapp ?? (data.whatsapp ? data.whatsapp : null),
        preferredDate: existing.preferredDate ?? data.preferredDate ?? null,
        projectInterest:
          existing.projectInterest ?? (data.projectInterest ? data.projectInterest : null),
        plotInterest: existing.plotInterest ?? (data.plotInterest ? data.plotInterest : null),
        sourcePage: existing.sourcePage ?? (data.sourcePage ? data.sourcePage : null),
        sourceListingId: existing.sourceListingId ?? sourceListingId,
        sourceProjectId: existing.sourceProjectId ?? sourceProjectId,
        sourceBlogPostId: existing.sourceBlogPostId ?? sourceBlogPostId,
        leadType: preferredLeadType(existing.leadType, data.leadType),
        phone: canonicalPhone(existing.phone),
        message: mergeMessage(existing.message, data.message ? data.message : null),
      },
    });
  }

  return prisma.lead.create({
    data: {
      name: data.name,
      email: data.email ? data.email : null,
      phone: canonicalPhone(data.phone),
      whatsapp: data.whatsapp ? data.whatsapp : null,
      buyerType: data.buyerType,
      leadType: data.leadType,
      message: data.message ? data.message : null,
      isCofarmer: data.isCofarmer,
      preferredDate: data.preferredDate ?? null,
      projectInterest: data.projectInterest ? data.projectInterest : null,
      plotInterest: data.plotInterest ? data.plotInterest : null,
      sourcePage: data.sourcePage ? data.sourcePage : null,
      status: "new",
      sourceListingId,
      sourceProjectId,
      sourceBlogPostId,
    },
  });
}

export async function listLeads(args: { actorRole: unknown; status?: LeadStatus }) {
  assertCanView(args.actorRole);
  return prisma.lead.findMany({
    where: args.status ? { status: args.status } : undefined,
    include: LEAD_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

export async function getLead(args: { actorRole: unknown; id: string }) {
  assertCanView(args.actorRole);
  const lead = await prisma.lead.findUnique({ where: { id: args.id }, include: LEAD_INCLUDE });
  if (!lead) {
    throw new NotFoundError("Lead not found.");
  }
  return lead;
}

export async function updateLeadStatus(args: {
  actorRole: unknown;
  id: string;
  status: LeadStatus;
}) {
  assertCanUpdate(args.actorRole);
  const existing = await prisma.lead.findUnique({
    where: { id: args.id },
    select: { id: true, status: true },
  });
  if (!existing) {
    throw new NotFoundError("Lead not found.");
  }
  if (!canTransitionLeadStatus(existing.status, args.status)) {
    throw new ValidationError(`Cannot change status from ${existing.status} to ${args.status}.`);
  }
  return prisma.lead.update({
    where: { id: args.id },
    data: { status: args.status },
    include: LEAD_INCLUDE,
  });
}

export async function addFollowUpNote(args: {
  actorRole: unknown;
  authorId: string;
  leadId: string;
  noteText: string;
  contactMethod: ContactMethod;
}) {
  assertCanUpdate(args.actorRole);
  const lead = await prisma.lead.findUnique({ where: { id: args.leadId }, select: { id: true } });
  if (!lead) {
    throw new NotFoundError("Lead not found.");
  }
  return prisma.followUpNote.create({
    data: {
      leadId: args.leadId,
      authorId: args.authorId,
      noteText: args.noteText,
      contactMethod: args.contactMethod,
    },
  });
}
