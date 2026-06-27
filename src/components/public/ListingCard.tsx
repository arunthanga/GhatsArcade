import Link from "next/link";
import { formatAcres, formatInr } from "@/lib/format";
import { BuyerTrustSnippet } from "./BuyerTypePersonalization";
import { SaveListingButton } from "./SaveListingButton";

export type ListingCardData = {
  slug: string;
  title: string;
  district: string;
  sizeAcres: number;
  priceInr: number;
  status: string;
};

export function ListingCard({ listing }: { listing: ListingCardData }) {
  return (
    <article
      data-testid="listing-card"
      className="group flex flex-col rounded-xl border border-brand-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <Link href={`/listings/${listing.slug}`} className="block">
        <h2 className="text-lg font-semibold text-brand-900 group-hover:text-brand-700">
          {listing.title}
        </h2>
      </Link>
      <p className="mt-1 text-sm text-brand-600">{listing.district}</p>
      <p className="mt-1 text-sm text-brand-600">{formatAcres(listing.sizeAcres)}</p>
      <BuyerTrustSnippet className="mt-3" />
      <div className="mt-3 flex items-center justify-between">
        <p className="text-base font-bold text-brand-800">{formatInr(listing.priceInr)}</p>
        {listing.status === "under_offer" ? (
          <span
            data-testid="badge-under-offer"
            className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
          >
            Under offer
          </span>
        ) : null}
      </div>
      <div className="mt-3">
        <SaveListingButton listing={listing} />
      </div>
    </article>
  );
}
