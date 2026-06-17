import Link from "next/link";
import { ListingCard } from "@/components/public/ListingCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { listPublicListings } from "@/server/listings";

export const dynamic = "force-dynamic";

const TRUST_SIGNALS = [
  { title: "Managed end-to-end", body: "We handle cultivation and upkeep so your land stays productive." },
  { title: "Clear documentation", body: "Transparent paperwork and guidance through every step." },
  { title: "Local expertise", body: "Deep roots in the Kerala-Tamil Nadu border region." },
] as const;

export default async function HomePage() {
  const featured = (await listPublicListings()).slice(0, 3);

  return (
    <main>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      <section className="bg-brand-900 text-brand-50">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:py-28">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Ghats Arcade</h1>
          <p className="mt-4 text-lg text-brand-200">Tranquility meets high-yields.</p>
          <p className="mx-auto mt-3 max-w-xl text-brand-100/80">
            Managed farmland and agricultural land in Kerala and the Kerala-Tamil Nadu border region.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/listings"
              className="rounded-lg bg-brand-50 px-6 py-3 font-medium text-brand-900 transition-colors hover:bg-white"
            >
              Browse listings
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-brand-200 px-6 py-3 font-medium text-brand-50 transition-colors hover:bg-brand-800"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-brand-900">Featured listings</h2>
          <Link href="/listings" className="text-sm font-medium text-brand-600 hover:text-brand-900">
            View all
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-brand-600">New listings are coming soon - check back shortly.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-brand-100 bg-brand-50/50">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-3">
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal.title}>
              <h3 className="text-lg font-semibold text-brand-800">{signal.title}</h3>
              <p className="mt-2 text-brand-600">{signal.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
