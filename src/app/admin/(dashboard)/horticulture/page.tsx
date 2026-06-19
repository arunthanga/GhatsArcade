import { HorticultureLogManager } from "@/components/admin/HorticultureLogManager";
import { listHorticultureLogs, listProjectsForLogging } from "@/server/horticulture";
import { requirePermission } from "@/server/session";

export const dynamic = "force-dynamic";

export default async function AdminHorticulturePage() {
  // Logs are project sub-records, gated under the project management permission.
  const user = await requirePermission("project:manage");
  const [logs, projects] = await Promise.all([
    listHorticultureLogs({ actorRole: user.role }),
    listProjectsForLogging({ actorRole: user.role }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Horticulture log</h1>
        <p className="text-sm text-slate-400">
          Internal record of on-the-ground activity — plantation, maintenance, harvest, irrigation
          and pest control — per project and, optionally, per plot.
        </p>
      </div>
      <HorticultureLogManager
        initialLogs={logs.map((log) => ({
          id: log.id,
          projectId: log.projectId,
          projectTitle: log.project.title,
          plotId: log.plotId,
          plotNumber: log.plot?.plotNumber ?? null,
          activityType: log.activityType,
          description: log.description,
          activityDate: log.activityDate.toISOString(),
        }))}
        projects={projects.map((p) => ({
          id: p.id,
          title: p.title,
          plots: p.plots.map((plot) => ({ id: plot.id, plotNumber: plot.plotNumber })),
        }))}
      />
    </div>
  );
}
