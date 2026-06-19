// Lead capture + CRM service layer (prj.md Section 3). Public capture is open;
// status updates and follow-up notes require an authenticated Owner/Admin. All writes
// funnel through here so role checks (src/lib/roles.ts) and the status pipeline
// (src/lib/lead-status.ts) are enforced server-side, never only in the UI.

import { prisma } from "@/lib/db";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import { canTransitionLeadStatus } from "@/lib/lead-status";
import { can } from "@/lib/roles";
import type { ContactMethod, LeadStatus } from "@/types";
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

// Public, unauthenticated. Source references that do not resolve are stored as null
// rather than rejected. `leadType` records which capture surface the lead used.
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

  return prisma.lead.create({
    data: {
      name: data.name,
      email: data.email ? data.email : null,
      phone: data.phone,
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
