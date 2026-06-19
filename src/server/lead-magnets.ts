// Lead-magnet service (prj.md Section 3 / 8). A lead magnet is a downloadable PDF gated
// behind a lead-capture form: the visitor exchanges contact details for the file. Admin
// CRUD is gated via can(role, "leadMagnet:manage"); public reads expose active magnets
// only. The actual capture-in-exchange-for-file flow lives in `recordDownload`.

import { prisma } from "@/lib/db";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { can } from "@/lib/roles";
import type { CreateLeadMagnetInput, UpdateLeadMagnetInput } from "@/lib/validation";
import { captureLead } from "@/server/leads";

function assertCanManage(actorRole: unknown): void {
  if (!can(actorRole, "leadMagnet:manage")) {
    throw new AuthorizationError("You are not allowed to manage lead magnets.");
  }
}

export async function createLeadMagnet(args: {
  actorRole: unknown;
  createdById: string;
  data: CreateLeadMagnetInput;
}) {
  assertCanManage(args.actorRole);
  return prisma.leadMagnetAsset.create({
    data: {
      title: args.data.title,
      fileUrl: args.data.fileUrl,
      isActive: args.data.isActive,
      createdById: args.createdById,
    },
  });
}

export async function updateLeadMagnet(args: {
  actorRole: unknown;
  id: string;
  data: UpdateLeadMagnetInput;
}) {
  assertCanManage(args.actorRole);
  const existing = await prisma.leadMagnetAsset.findUnique({
    where: { id: args.id },
    select: { id: true },
  });
  if (!existing) {
    throw new NotFoundError("Lead magnet not found.");
  }
  return prisma.leadMagnetAsset.update({ where: { id: args.id }, data: args.data });
}

export async function deleteLeadMagnet(args: { actorRole: unknown; id: string }): Promise<void> {
  assertCanManage(args.actorRole);
  const existing = await prisma.leadMagnetAsset.findUnique({
    where: { id: args.id },
    select: { id: true },
  });
  if (!existing) {
    throw new NotFoundError("Lead magnet not found.");
  }
  await prisma.leadMagnetAsset.delete({ where: { id: args.id } });
}

// --- Public reads ---------------------------------------------------------

export async function listActiveLeadMagnets() {
  return prisma.leadMagnetAsset.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true },
  });
}

// --- Admin reads ----------------------------------------------------------

export async function listAllLeadMagnets(args: { actorRole: unknown }) {
  assertCanManage(args.actorRole);
  return prisma.leadMagnetAsset.findMany({ orderBy: { createdAt: "desc" } });
}

// --- Gated download -------------------------------------------------------

// Public. Captures a `lead_magnet_download` lead, bumps the download counter, and returns
// the file URL so the caller can hand it to the visitor. An inactive/unknown magnet
// yields null (the route maps that to a 404) so we never leak a withdrawn asset.
export async function recordDownload(args: {
  id: string;
  lead: {
    name: string;
    phone: string;
    email?: string;
    whatsapp?: string;
    sourceBlogPostId?: string;
    sourcePage?: string;
  };
}): Promise<{ fileUrl: string; title: string } | null> {
  const magnet = await prisma.leadMagnetAsset.findUnique({ where: { id: args.id } });
  if (!magnet || !magnet.isActive) {
    return null;
  }

  await captureLead({
    name: args.lead.name,
    phone: args.lead.phone,
    email: args.lead.email,
    whatsapp: args.lead.whatsapp,
    buyerType: "resident_indian",
    leadType: "lead_magnet_download",
    isCofarmer: false,
    projectInterest: `Lead magnet: ${magnet.title}`,
    sourceBlogPostId: args.lead.sourceBlogPostId,
    sourcePage: args.lead.sourcePage,
  });

  await prisma.leadMagnetAsset.update({
    where: { id: magnet.id },
    data: { downloadCount: { increment: 1 } },
  });

  return { fileUrl: magnet.fileUrl, title: magnet.title };
}
