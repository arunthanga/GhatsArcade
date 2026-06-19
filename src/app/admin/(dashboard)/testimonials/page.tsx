import { TestimonialManager } from "@/components/admin/TestimonialManager";
import { listAllProjects } from "@/server/projects";
import { requirePermission } from "@/server/session";
import { listAllTestimonials } from "@/server/testimonials";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const user = await requirePermission("testimonial:manage");
  const [testimonials, projects] = await Promise.all([
    listAllTestimonials({ actorRole: user.role }),
    listAllProjects({ actorRole: user.role }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Testimonials</h1>
        <p className="text-sm text-slate-400">
          Real owner stories powering the home page carousel. Reorder with the display number,
          hide one without deleting it, and optionally attach a YouTube video and a linked project.
        </p>
      </div>
      <TestimonialManager
        initialTestimonials={testimonials.map((t) => ({
          id: t.id,
          buyerName: t.buyerName,
          buyerCity: t.buyerCity,
          buyerType: t.buyerType,
          quoteText: t.quoteText,
          videoUrl: t.videoUrl,
          displayOrder: t.displayOrder,
          isActive: t.isActive,
          projectId: t.projectId,
        }))}
        projects={projects.map((p) => ({ id: p.id, title: p.title }))}
      />
    </div>
  );
}
