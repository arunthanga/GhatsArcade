import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConstructionDisclaimer } from "@/components/public/ConstructionDisclaimer";
import { LeadInquiryForm } from "@/components/public/LeadInquiryForm";
import { LegalDisclaimer } from "@/components/public/LegalDisclaimer";
import { PlotHoldForm } from "@/components/public/PlotHoldForm";
import { LocationMap } from "@/components/public/LocationMap";
import { RegistrationSteps } from "@/components/public/RegistrationSteps";
import { StickyProjectCta } from "@/components/public/StickyProjectCta";
import { TrustProofStrip } from "@/components/public/TrustProofStrip";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { publicEnv } from "@/lib/env";
import { formatAcres, formatInr } from "@/lib/format";
import { countAvailablePlots } from "@/lib/plot-status";
import { absoluteUrl } from "@/lib/seo";
import { getPublicProjectBySlug } from "@/server/projects";

export const dynamic = "force-dynamic";

type LocationDistance = { city: string; km: number; driveMinutes?: number };
type NearbyAttraction = {
  name: string;
  distanceKm?: number;
  driveMinutes?: number;
  description?: string;
  seasonalNote?: string;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) {
    return { title: "Project not found" };
  }
  const url = absoluteUrl(`/projects/${slug}`);
  const description = project.tagline ?? `${project.title} - managed farmland in ${project.locationDistrict}.`;
  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description,
      url,
      type: "website",
      images: project.coverPhotoUrl ? [{ url: project.coverPhotoUrl }] : undefined,
    },
  };
}

const PLOT_STATUS_LABEL: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const remaining = countAvailablePlots(project.plots);
  const distances = asArray<LocationDistance>(project.locationDistances);
  const attractions = asArray<NearbyAttraction>(project.nearbyAttractions);
  const hasCoords = project.latitude != null && project.longitude != null;
  const whatsappNumber = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 pb-24 sm:pb-10">
      {/* Hero */}
      <header className="mb-8">
        {project.theme ? (
          <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
            {project.theme}
          </span>
        ) : null}
        <h1 className="mt-3 text-3xl font-semibold text-brand-900">{project.title}</h1>
        <p className="mt-1 text-brand-700">
          {project.locationDistrict}
          {project.locationNearestTown ? `, near ${project.locationNearestTown}` : ""}
        </p>
        {project.tagline ? <p className="mt-2 text-lg text-brand-600">{project.tagline}</p> : null}
        <p
          data-testid="plots-remaining"
          className="mt-4 inline-block rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-brand-50"
        >
          {remaining > 0 ? `${remaining} plots remaining` : "Currently sold out"}
        </p>
      </header>

      {project.coverPhotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.coverPhotoUrl}
          alt={project.title}
          className="mb-8 h-72 w-full rounded-xl object-cover"
        />
      ) : null}

      <TrustProofStrip className="mb-10 rounded-xl border border-brand-100" compact />

      {/* About (rich text — sanitized on write) */}
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold text-brand-900">About this project</h2>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is sanitised in src/lib/sanitize.ts before persistence */}
        <div
          className="prose prose-brand max-w-none leading-relaxed text-brand-800"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />
      </section>

      {/* Location, map & distances */}
      {distances.length > 0 || hasCoords ? (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-brand-900">Location</h2>
          {hasCoords ? (
            <div className="mb-4">
              <LocationMap
                latitude={project.latitude as number}
                longitude={project.longitude as number}
                title={project.title}
              />
            </div>
          ) : null}
          {distances.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {distances.map((d) => (
                <li key={d.city} className="rounded-lg border border-brand-100 bg-white p-3 text-sm">
                  <p className="font-medium text-brand-800">{d.city}</p>
                  <p className="text-brand-600">
                    {d.km} km{d.driveMinutes ? ` - ${d.driveMinutes} min` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {/* The estate / specs */}
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold text-brand-900">The estate</h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {project.totalAreaAcres ? (
            <Spec label="Total area">{formatAcres(project.totalAreaAcres)}</Spec>
          ) : null}
          <Spec label="Land classification">{project.landRevenueClassification}</Spec>
          <Spec label="Road status">{project.roadStatus.replace(/_/g, " ")}</Spec>
          {project.roadSpec ? <Spec label="Road spec">{project.roadSpec}</Spec> : null}
          {project.waterSourceDescription ? (
            <Spec label="Water source">{project.waterSourceDescription}</Spec>
          ) : null}
          {project.clubhouseDescription ? (
            <Spec label="Clubhouse">{project.clubhouseDescription}</Spec>
          ) : null}
          {project.plantationDescription ? (
            <Spec label="Plantation">{project.plantationDescription}</Spec>
          ) : null}
        </dl>
      </section>

      {/* Plot availability */}
      {project.plots.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-brand-900">Plot availability</h2>
          <div className="overflow-x-auto rounded-lg border border-brand-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50 text-brand-700">
                <tr>
                  <th className="px-3 py-2">Plot</th>
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Price / cent</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {project.plots.map((plot) => (
                  <tr key={plot.id} className="border-t border-brand-100">
                    <td className="px-3 py-2 font-medium text-brand-800">{plot.plotNumber}</td>
                    <td className="px-3 py-2 text-brand-600">{plot.sizeCents} cents</td>
                    <td className="px-3 py-2 text-brand-600">{formatInr(plot.pricePerCent)}</td>
                    <td className="px-3 py-2 text-brand-600">{formatInr(plot.totalPrice)}</td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          plot.status === "available"
                            ? "font-medium text-brand-700"
                            : "text-brand-400"
                        }
                      >
                        {PLOT_STATUS_LABEL[plot.status] ?? plot.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mid-page low-friction capture, right after the plot grid. */}
          {remaining > 0 ? (
            <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-6">
              <PlotHoldForm
                sourceProjectId={project.id}
                projectInterest={project.title}
                sourcePage={`/projects/${project.slug}`}
              />
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Nearby attractions */}
      {attractions.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-brand-900">In and around</h2>
          <ul className="space-y-3">
            {attractions.map((a) => (
              <li key={a.name} className="rounded-lg border border-brand-100 bg-white p-4 text-sm">
                <p className="font-medium text-brand-800">
                  {a.name}
                  {a.distanceKm ? (
                    <span className="font-normal text-brand-500"> - {a.distanceKm} km</span>
                  ) : null}
                </p>
                {a.description ? <p className="mt-1 text-brand-600">{a.description}</p> : null}
                {a.seasonalNote ? (
                  <p className="mt-1 text-xs text-brand-500">{a.seasonalNote}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Legal checklist */}
      {project.legalChecklistSummary ? (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold text-brand-900">Legal due diligence</h2>
          <p className="whitespace-pre-line leading-relaxed text-brand-800">
            {project.legalChecklistSummary}
          </p>
        </section>
      ) : null}

      {/* How to register — removes process paralysis before the final ask */}
      <RegistrationSteps />

      {/* CTA */}
      <section className="mb-10 rounded-xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="text-xl font-semibold text-brand-900">Come see it for yourself</h2>
        <p className="mt-2 text-brand-700">
          Schedule a site visit - our team will walk you through {project.title} in person.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/contact?project=${encodeURIComponent(project.title)}&projectId=${project.id}`}
            className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-800"
          >
            Schedule a Site Visit for This Project
          </Link>
          {whatsappNumber ? (
            <WhatsAppButton
              phone={whatsappNumber}
              message={`Hi, I'm interested in the "${project.title}" project.`}
            />
          ) : null}
        </div>
      </section>

      {/* Bottom-of-page full inquiry, after all trust signals (prj.md Section 3.1). */}
      <section className="mb-10 rounded-xl border border-brand-100 bg-white p-6">
        <LeadInquiryForm
          heading={`Enquire about ${project.title}`}
          submitLabel="Send enquiry"
          askWhatsApp
          projectInterest={project.title}
          sourceProjectId={project.id}
          sourcePage={`/projects/${project.slug}`}
        />
      </section>

      {/* Hard-requirement disclaimers (kept as two distinct components) */}
      <div className="space-y-4">
        <ConstructionDisclaimer />
        <div className="rounded-lg border border-brand-100 bg-white p-4 text-xs leading-relaxed text-brand-600">
          <LegalDisclaimer />
        </div>
      </div>

      <StickyProjectCta title={project.title} projectId={project.id} remaining={remaining} />
    </main>
  );
}

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-brand-50 py-1.5">
      <dt className="text-brand-500">{label}</dt>
      <dd className="text-right font-medium text-brand-800">{children}</dd>
    </div>
  );
}
