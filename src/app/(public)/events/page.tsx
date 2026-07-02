import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { listPublicEvents } from "@/server/events";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events & Open Days",
  description:
    "Upcoming open days and farm visits at Ghats Arcade managed-farmland projects — plus a look back at past gatherings.",
  alternates: { canonical: absoluteUrl("/events") },
};

type PublicEvent = Awaited<ReturnType<typeof listPublicEvents>>[number];

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

function EventCard({ event }: { event: PublicEvent }) {
  const cover = event.photos[0];
  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white transition-shadow hover:shadow-md">
      <Link href={`/events/${event.slug}`} className="flex h-full flex-col">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt={cover.alt ?? event.title}
            className="h-44 w-full object-cover"
          />
        ) : null}
        <div className="flex flex-1 flex-col p-5">
          <time dateTime={event.eventDate.toISOString()} className="text-xs text-brand-500">
            {formatDate(event.eventDate)}
          </time>
          <h3 className="mt-1 text-lg font-semibold text-brand-800">{event.title}</h3>
          {event.theme ? <p className="mt-1 text-sm text-brand-600">{event.theme}</p> : null}
          {event.project ? (
            <p className="mt-2 text-xs text-brand-500">At {event.project.title}</p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}

export default async function EventsPage() {
  const events = await listPublicEvents();
  const upcoming = events
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
  const past = events.filter((e) => e.status === "past"); // already date-desc from the query

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-brand-900 sm:text-4xl">
          Events &amp; Open Days
        </h1>
        <p className="mt-3 max-w-2xl text-brand-700">
          Come see a managed farmland project in person. Join an upcoming open day, or browse photos
          from past gatherings.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-brand-900">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="rounded-lg border border-brand-100 bg-brand-50 p-6 text-brand-600">
            No open days scheduled right now.{" "}
            <Link href="/contact" className="font-medium text-brand-700 underline">
              Request a private site visit
            </Link>{" "}
            and we'll arrange one.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 ? (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-brand-900">Past events</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
