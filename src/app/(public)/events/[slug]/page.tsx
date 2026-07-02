import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SanitizedHtml } from "@/components/public/SanitizedHtml";
import { absoluteUrl } from "@/lib/seo";
import { getPublicEventBySlug } from "@/server/events";

export const dynamic = "force-dynamic";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) {
    return { title: "Event not found" };
  }
  const url = absoluteUrl(`/events/${slug}`);
  const description = `${event.title} — ${formatDate(event.eventDate)}${
    event.project ? ` at ${event.project.title}` : ""
  }.`;
  return {
    title: event.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: event.title,
      description,
      url,
      type: "website",
      images: event.photos[0] ? [{ url: event.photos[0].url }] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
            {event.status === "upcoming" ? "Upcoming" : "Past event"}
          </span>
          <time dateTime={event.eventDate.toISOString()} className="text-sm text-brand-500">
            {formatDate(event.eventDate)}
          </time>
        </div>
        <h1 className="text-3xl font-semibold text-brand-900">{event.title}</h1>
        {event.theme ? <p className="mt-1 text-brand-700">{event.theme}</p> : null}
        {event.project ? (
          <p className="mt-1 text-sm text-brand-600">
            At{" "}
            <Link href={`/projects/${event.project.slug}`} className="text-brand-700 underline">
              {event.project.title}
            </Link>
          </p>
        ) : null}
      </header>

      {/* Description (rich text — sanitized on write, re-sanitized on render for defense-in-depth) */}
      <SanitizedHtml
        className="prose prose-brand max-w-none leading-relaxed text-brand-800"
        html={event.description}
      />

      {event.photos.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {event.photos.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <li key={photo.id}>
              <img
                src={photo.url}
                alt={photo.alt ?? event.title}
                className="h-64 w-full rounded-lg object-cover"
              />
            </li>
          ))}
        </ul>
      ) : null}

      <section className="mt-12 rounded-xl border border-brand-100 bg-brand-50 p-6 text-center">
        <h2 className="text-xl font-semibold text-brand-900">Want to attend or visit?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-brand-600">
          Tell us you're interested and we'll save you a spot or arrange a private site visit.
        </p>
        <div className="mt-4">
          <Link
            href={
              event.project
                ? `/contact?project=${encodeURIComponent(event.project.title)}&projectId=${event.projectId}`
                : "/contact"
            }
            className="inline-block rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-800"
          >
            Book a site visit
          </Link>
        </div>
      </section>
    </main>
  );
}
