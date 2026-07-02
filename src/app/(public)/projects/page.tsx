import type { Metadata } from "next";
import Link from "next/link";
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

function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

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
  const activeFilters = [
    filters.district ? `District: ${filters.district}` : null,
    filters.status ? `Status: ${statusLabel(filters.status)}` : null,
    filters.minPricePerCent !== undefined
      ? `From ${filters.minPricePerCent.toLocaleString("en-IN")} INR / cent`
      : null,
    filters.maxPricePerCent !== undefined
      ? `Up to ${filters.maxPricePerCent.toLocaleString("en-IN")} INR / cent`
      : null,
    filters.minCents !== undefined ? `From ${filters.minCents} cents` : null,
    filters.maxCents !== undefined ? `Up to ${filters.maxCents} cents` : null,
  ].filter((filter): filter is string => Boolean(filter));
  const resultLabel = `${projects.length} ${projects.length === 1 ? "project" : "projects"} found`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Our Projects</h1>
          <p className="mt-2 max-w-2xl text-brand-700">
            Theme-based, managed farmland on the Kerala-Tamil Nadu border. Clear titles, engineered
            infrastructure, and a resident team that lives here.
          </p>
        </div>
        <p className="text-sm font-medium text-brand-700">{resultLabel}</p>
      </div>

      <form
        method="get"
        className="mt-6 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-brand-700">
            District
            <input
              type="text"
              name="district"
              placeholder="Palakkad"
              defaultValue={filters.district ?? ""}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-brand-700">
            Status
            <select name="status" defaultValue={filters.status ?? ""} className={inputClass}>
              <option value="">Any status</option>
              {PUBLIC_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-brand-700">
            Min price / cent
            <input
              type="number"
              name="minPricePerCent"
              placeholder="250000"
              defaultValue={filters.minPricePerCent ?? ""}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-brand-700">
            Max price / cent
            <input
              type="number"
              name="maxPricePerCent"
              placeholder="500000"
              defaultValue={filters.maxPricePerCent ?? ""}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-brand-700">
            Min plot size
            <input
              type="number"
              name="minCents"
              step="1"
              placeholder="10"
              defaultValue={filters.minCents ?? ""}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-brand-700">
            Max plot size
            <input
              type="number"
              name="maxCents"
              step="1"
              placeholder="50"
              defaultValue={filters.maxCents ?? ""}
              className={inputClass}
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-brand-700 px-5 py-2 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-800"
          >
            Show projects
          </button>
          {activeFilters.length > 0 ? (
            <Link
              href="/projects"
              className="text-sm font-medium text-brand-700 hover:text-brand-900"
            >
              Clear filters
            </Link>
          ) : null}
        </div>
      </form>

      {activeFilters.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Active project filters">
          {activeFilters.map((filter) => (
            <span
              key={filter}
              role="listitem"
              className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800"
            >
              {filter}
            </span>
          ))}
        </div>
      ) : null}

      {projects.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-brand-100 bg-white p-6 text-brand-700">
          <p className="font-medium text-brand-900">No projects match your search yet.</p>
          <p className="mt-1 text-sm">
            Try widening your price or plot-size filters, or contact us for upcoming phases.
          </p>
        </div>
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
