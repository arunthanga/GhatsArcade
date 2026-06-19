import { ProjectManager } from "@/components/admin/ProjectManager";
import { listAllProjects } from "@/server/projects";
import { requirePermission } from "@/server/session";

export default async function AdminProjectsPage() {
  const user = await requirePermission("project:manage");
  const projects = await listAllProjects({ actorRole: user.role });

  return (
    <main>
      <h1>Manage Projects</h1>
      <ProjectManager
        initialProjects={projects.map((project) => ({
          id: project.id,
          title: project.title,
          slug: project.slug,
          locationDistrict: project.locationDistrict,
          status: project.status,
          plots: project.plots.map((plot) => ({ status: plot.status })),
        }))}
      />
    </main>
  );
}
