import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadInquiryForm } from "@/components/public/LeadInquiryForm";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicEnv } from "@/lib/env";
import { formatAcres, formatInr } from "@/lib/format";
import { absoluteUrl, listingJsonLd } from "@/lib/seo";
import { getPublicListingBySlug } from "@/server/listings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getPublicListingBySlug(slug);
  if (!listing) {
    return { title: "Listing not found" };
  }
  const url = absoluteUrl(`/listings/${slug}`);
  const description = listing.description.slice(0, 160);
  return {
    title: listing.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: listing.title,
      description,
      url,
      type: "website",
      images: listing.photos.map((photo) => ({ url: photo.url })),
    },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getPublicListingBySlug(slug);
  if (!listing) {
    notFound();
  }

  const whatsappNumber = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={listingJsonLd(listing)} />

      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-brand-900">{listing.title}</h1>
        <p className="mt-1 text-brand-700">
          {listing.district}
          {listing.nearestTown ? `, near ${listing.nearestTown}` : ""}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="text-2xl font-bold text-brand-800">{formatInr(listing.priceInr)}</span>
          <span className="text-brand-600">{formatAcres(listing.sizeAcres)}</span>
          {listing.status === "under_offer" ? (
            <span
              data-testid="badge-under-offer"
              className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
            >
              Under offer
            </span>
          ) : null}
        </div>
      </header>

      {listing.photos.length > 0 ? (
        <ul className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {listing.photos.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <li key={photo.id}>
              <img
                src={photo.url}
                alt={photo.alt ?? listing.title}
                className="h-64 w-full rounded-lg object-cover"
              />
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mb-8 whitespace-pre-line leading-relaxed text-brand-800">{listing.description}</p>

      {whatsappNumber ? (
        <div className="mb-8">
          <WhatsAppButton
            phone={whatsappNumber}
            message={`Hi, I'm interested in "${listing.title}" (${slug}).`}
          />
        </div>
      ) : null}

      <div className="rounded-xl border border-brand-100 bg-brand-50 p-6">
        <LeadInquiryForm sourceListingId={listing.id} />
      </div>
    </main>
  );
}
