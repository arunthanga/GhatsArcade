import { EventManager } from "@/components/admin/EventManager";
import { listAllEvents } from "@/server/events";
import { listAllProjects } from "@/server/projects";
import { requirePermission } from "@/server/session";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const user = await requirePermission("event:manage");
  const [events, projects] = await Promise.all([
    listAllEvents({ actorRole: user.role }),
    listAllProjects({ actorRole: user.role }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Events</h1>
        <p className="text-sm text-slate-400">
          Publish upcoming open days and farm visits, and keep a gallery of past events as social
          proof. Optionally link an event to a project.
        </p>
      </div>
      <EventManager
        initialEvents={events.map((evt) => ({
          id: evt.id,
          title: evt.title,
          slug: evt.slug,
          status: evt.status,
          eventDate: evt.eventDate.toISOString(),
          theme: evt.theme,
          description: evt.description,
          projectId: evt.projectId,
          photos: evt.photos.map((p) => ({ url: p.url, alt: p.alt })),
        }))}
        projects={projects.map((p) => ({ id: p.id, title: p.title }))}
      />
    </div>
  );
}
