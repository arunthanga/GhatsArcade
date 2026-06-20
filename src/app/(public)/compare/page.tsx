import type { Metadata } from "next";
import Link from "next/link";
import { formatAcres, formatInr } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";
import { getPublicListingBySlug } from "@/server/listings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compare listings",
  description: "Compare managed farmland listings side by side.",
  alternates: { canonical: absoluteUrl("/compare") },
};

// Accepts ?ids=slug-a,slug-b,slug-c (2-3 listings). Slugs keep the URL shareable.
function parseIds(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : (value ?? "");
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((slug) => slug.trim())
        .filter(Boolean),
    ),
  ).slice(0, 3);
}

type ComparedListing = NonNullable<Awaited<ReturnType<typeof getPublicListingBySlug>>>;

const ROWS: { label: string; render: (listing: ComparedListing) => string }[] = [
  {
    label: "Location",
    render: (l) => (l.nearestTown ? `${l.district}, near ${l.nearestTown}` : l.district),
  },
  { label: "Size", render: (l) => formatAcres(l.sizeAcres) },
  { label: "Price", render: (l) => formatInr(l.priceInr) },
  { label: "Land type", render: (l) => l.landType.replace(/_/g, " ") },
];

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { ids } = await searchParams;
  const slugs = parseIds(ids);
  const fetched = await Promise.all(slugs.map((slug) => getPublicListingBySlug(slug)));
  const listings = fetched.filter((listing): listing is ComparedListing => listing !== null);
  const needsMoreListings = slugs.length >= 2 && listings.length === 1;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-brand-900">Compare listings</h1>

      {listings.length < 2 ? (
        <p className="mt-10 text-brand-600">
          {needsMoreListings
            ? "Only one of those listings is still available. Save or pick one more listing to compare."
            : "Pick 2-3 listings to compare. Save listings you like, then open the comparison from"}
          {!needsMoreListings ? (
            <>
              {" "}
              your{" "}
              <Link
                href="/saved"
                className="font-medium text-brand-700 underline-offset-2 hover:underline"
              >
                saved listings
              </Link>
              .
            </>
          ) : null}
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="border-b border-brand-100 p-3 font-medium text-brand-500">
                  Feature
                </th>
                {listings.map((listing) => (
                  <th key={listing.slug} className="border-b border-brand-100 p-3">
                    <Link
                      href={`/listings/${listing.slug}`}
                      className="font-semibold text-brand-900 hover:text-brand-700"
                    >
                      {listing.title}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="border-b border-brand-100 p-3 font-medium text-brand-600"
                  >
                    {row.label}
                  </th>
                  {listings.map((listing) => (
                    <td
                      key={listing.slug}
                      className="border-b border-brand-100 p-3 text-brand-800"
                    >
                      {row.render(listing)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
