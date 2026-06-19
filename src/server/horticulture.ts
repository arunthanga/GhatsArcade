// Horticulture log service (prj.md Section 8). An internal, operational record of
// on-the-ground activity (plantation/maintenance/harvest/irrigation/pest control) per
// project, optionally per plot. Logs are sub-records of a project, so they're gated under
// the existing "project:manage" permission rather than a separate one. Admin/back-office
// only — there is no public surface.

import { prisma } from "@/lib/db";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { can } from "@/lib/roles";
import type { CreateHorticultureLogInput, UpdateHorticultureLogInput } from "@/lib/validation";

const LOG_INCLUDE = {
  project: { select: { id: true, title: true } },
  plot: { select: { id: true, plotNumber: true } },
} as const;

function assertCanManage(actorRole: unknown): void {
  if (!can(actorRole, "project:manage")) {
    throw new AuthorizationError("You are not allowed to manage horticulture logs.");
  }
}

async function assertProjectExists(projectId: string): Promise<void> {
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } });
  if (!project) {
    throw new NotFoundError("Project not found.");
  }
}

// Resolve an optional plot link, failing open to null unless the plot exists *and* belongs to
// the given project (so a log can never be attached to another project's plot).
async function resolvePlotId(
  plotId: string | undefined,
  projectId: string | undefined,
): Promise<string | null> {
  if (!plotId || !projectId) {
    return null;
  }
  const plot = await prisma.plot.findFirst({
    where: { id: plotId, projectId },
    select: { id: true },
  });
  return plot?.id ?? null;
}

// --- Writes ---------------------------------------------------------------

export async function createHorticultureLog(args: {
  actorRole: unknown;
  loggedById: string;
  data: CreateHorticultureLogInput;
}) {
  assertCanManage(args.actorRole);
  const { projectId, plotId, ...rest } = args.data;
  await assertProjectExists(projectId);

  return prisma.horticultureLog.create({
    data: {
      ...rest,
      projectId,
      plotId: await resolvePlotId(plotId, projectId),
      loggedById: args.loggedById,
    },
    include: LOG_INCLUDE,
  });
}

export async function updateHorticultureLog(args: {
  actorRole: unknown;
  id: string;
  data: UpdateHorticultureLogInput;
}) {
  assertCanManage(args.actorRole);
  const existing = await prisma.horticultureLog.findUnique({
    where: { id: args.id },
    select: { id: true, projectId: true },
  });
  if (!existing) {
    throw new NotFoundError("Horticulture log not found.");
  }

  const { projectId, plotId, ...rest } = args.data;
  if (projectId !== undefined) {
    await assertProjectExists(projectId);
  }
  const effectiveProjectId = projectId ?? existing.projectId;

  return prisma.horticultureLog.update({
    where: { id: args.id },
    data: {
      ...rest,
      ...(projectId !== undefined ? { projectId } : {}),
      // Re-resolve the plot whenever either the plot or the project changes.
      ...(plotId !== undefined || projectId !== undefined
        ? { plotId: await resolvePlotId(plotId, effectiveProjectId) }
        : {}),
    },
    include: LOG_INCLUDE,
  });
}

export async function deleteHorticultureLog(args: { actorRole: unknown; id: string }): Promise<void> {
  assertCanManage(args.actorRole);
  const existing = await prisma.horticultureLog.findUnique({
    where: { id: args.id },
    select: { id: true },
  });
  if (!existing) {
    throw new NotFoundError("Horticulture log not found.");
  }
  await prisma.horticultureLog.delete({ where: { id: args.id } });
}

// --- Admin reads ----------------------------------------------------------

export async function listHorticultureLogs(args: { actorRole: unknown; projectId?: string }) {
  assertCanManage(args.actorRole);
  return prisma.horticultureLog.findMany({
    where: args.projectId ? { projectId: args.projectId } : undefined,
    include: LOG_INCLUDE,
    orderBy: { activityDate: "desc" },
  });
}

// Projects (with their plots) for the logging form's dependent dropdowns.
export async function listProjectsForLogging(args: { actorRole: unknown }) {
  assertCanManage(args.actorRole);
  return prisma.project.findMany({
    select: {
      id: true,
      title: true,
      plots: { select: { id: true, plotNumber: true }, orderBy: { plotNumber: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}
