import Link from "next/link";
import { notFound } from "next/navigation";
import { PlotManager } from "@/components/admin/PlotManager";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { NotFoundError } from "@/lib/errors";
import { getProjectForAdmin } from "@/server/projects";
import { requirePermission } from "@/server/session";

function str(value: string | null | undefined): string {
  return value ?? "";
}

function num(value: number | null | undefined): string {
  return value === null || value === undefined ? "" : String(value);
}

export default async function AdminProjectPlotsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePermission("project:manage");
  const { id } = await params;

  let project: Awaited<ReturnType<typeof getProjectForAdmin>>;
  try {
    project = await getProjectForAdmin({ actorRole: user.role, id });
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/projects" className="text-sm text-emerald-400 hover:underline">
          &larr; All projects
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">{project.title}</h1>
        <p className="text-sm text-slate-400">
          {project.status} &middot; {project.locationDistrict}
        </p>
      </div>

      <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Details &amp; media</h2>
        <ProjectEditor
          projectId={project.id}
          initial={{
            title: project.title,
            tagline: str(project.tagline),
            theme: str(project.theme),
            description: project.description,
            locationDistrict: project.locationDistrict,
            locationNearestTown: str(project.locationNearestTown),
            latitude: num(project.latitude),
            longitude: num(project.longitude),
            keralaTnBorder: project.keralaTnBorder,
            totalAreaAcres: num(project.totalAreaAcres),
            landRevenueClassification: project.landRevenueClassification,
            roadStatus: project.roadStatus,
            roadSpec: str(project.roadSpec),
            clubhouseDescription: str(project.clubhouseDescription),
            waterSourceDescription: str(project.waterSourceDescription),
            plantationDescription: str(project.plantationDescription),
            maintenanceFeePerCentPerMonth: num(project.maintenanceFeePerCentPerMonth),
            legalChecklistSummary: str(project.legalChecklistSummary),
            coverPhotoUrl: str(project.coverPhotoUrl),
            videoEmbedUrl: str(project.videoEmbedUrl),
            photos: project.photos.map((photo) => ({
              url: photo.url,
              alt: photo.alt ?? undefined,
              tag: photo.tag ?? undefined,
            })),
          }}
        />
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Plots</h2>
        <PlotManager
          projectId={project.id}
          initialPlots={project.plots.map((plot) => ({
            id: plot.id,
            plotNumber: plot.plotNumber,
            sizeCents: plot.sizeCents,
            pricePerCent: plot.pricePerCent,
            totalPrice: plot.totalPrice,
            status: plot.status,
          }))}
        />
      </section>
    </div>
  );
}
