import Link from "next/link";
import { formatInr } from "@/lib/format";
import { countAvailablePlots } from "@/lib/plot-status";

export type ProjectCardData = {
  slug: string;
  title: string;
  tagline: string | null;
  locationDistrict: string;
  status: string;
  coverPhotoUrl: string | null;
  plots: { status: string; pricePerCent: number }[];
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  published: { label: "Ongoing", className: "bg-brand-100 text-brand-800" },
  coming_soon: { label: "Coming soon", className: "bg-sky-100 text-sky-800" },
  sold_out: { label: "Sold out", className: "bg-stone-200 text-stone-700" },
};

function startingPricePerCent(plots: { pricePerCent: number }[]): number | null {
  if (plots.length === 0) {
    return null;
  }
  return plots.reduce((min, plot) => Math.min(min, plot.pricePerCent), Number.POSITIVE_INFINITY);
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const remaining = countAvailablePlots(project.plots);
  const startPrice = startingPricePerCent(project.plots);
  const badge = STATUS_BADGE[project.status];

  return (
    <article
      data-testid="project-card"
      className="group flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        {project.coverPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverPhotoUrl}
            alt={project.title}
            className="h-44 w-full object-cover"
          />
        ) : (
          <div className="h-44 w-full bg-brand-100" />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/projects/${project.slug}`} className="block">
            <h2 className="text-lg font-semibold text-brand-900 group-hover:text-brand-700">
              {project.title}
            </h2>
          </Link>
          {badge ? (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
              {badge.label}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-brand-600">{project.locationDistrict}</p>
        {project.tagline ? <p className="mt-2 text-sm text-brand-600">{project.tagline}</p> : null}

        <div className="mt-4 flex items-end justify-between">
          <div>
            {startPrice !== null ? (
              <p className="text-base font-bold text-brand-800">
                {formatInr(startPrice)}
                <span className="text-xs font-normal text-brand-500"> / cent</span>
              </p>
            ) : null}
          </div>
          <span data-testid="plots-remaining" className="text-xs font-medium text-brand-700">
            {remaining > 0 ? `${remaining} plots remaining` : "No plots available"}
          </span>
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-4 text-sm font-medium text-brand-700 hover:text-brand-900"
        >
          View project →
        </Link>
      </div>
    </article>
  );
}
