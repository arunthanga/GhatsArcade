import type { Metadata } from "next";
import { ProjectCard } from "@/components/public/ProjectCard";
import { absoluteUrl } from "@/lib/seo";
import { projectFilterSchema } from "@/lib/validation";
import { listPublicProjects } from "@/server/projects";
import { PROJECT_STATUSES } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Explore Ghats Arcade managed-farmland projects on the Kerala-Tamil Nadu border - plot sizes, pricing, and availability.",
  alternates: { canonical: absoluteUrl("/projects") },
};

// Public statuses a visitor may filter by (drives the dropdown).
const PUBLIC_STATUS_OPTIONS = PROJECT_STATUSES.filter((s) => s !== "draft");

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = projectFilterSchema.safeParse(raw);
  const filters = parsed.success ? parsed.data : {};
  const projects = await listPublicProjects(filters);

  const inputClass =
    "rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-brand-900 placeholder:text-brand-400 focus:border-brand-500 focus:outline-none";

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-brand-900">Our Projects</h1>
      <p className="mt-2 max-w-2xl text-brand-700">
        Theme-based, managed farmland on the Kerala-Tamil Nadu border. Clear titles,
        engineered infrastructure, and a resident team that lives here.
      </p>

      <form method="get" className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          name="district"
          placeholder="District"
          defaultValue={filters.district ?? ""}
          className={inputClass}
        />
        <select name="status" defaultValue={filters.status ?? ""} className={inputClass}>
          <option value="">Any status</option>
          {PUBLIC_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="minPricePerCent"
          placeholder="Min price/cent"
          defaultValue={filters.minPricePerCent ?? ""}
          className={inputClass}
        />
        <input
          type="number"
          name="maxPricePerCent"
          placeholder="Max price/cent"
          defaultValue={filters.maxPricePerCent ?? ""}
          className={inputClass}
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-700 px-5 py-2 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-800"
        >
          Filter
        </button>
      </form>

      {projects.length === 0 ? (
        <p className="mt-10 text-brand-600">No projects match your search yet. Check back soon.</p>
      ) : (
        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      )}
    </main>
  );
}
