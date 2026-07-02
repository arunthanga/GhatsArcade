import type { Metadata } from "next";
import { BuyerTypeSelector } from "@/components/public/BuyerTypePersonalization";
import { ListingCard } from "@/components/public/ListingCard";
import { absoluteUrl } from "@/lib/seo";
import { listingFilterSchema } from "@/lib/validation";
import { listPublicListings } from "@/server/listings";
import { LAND_TYPES } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Listings",
  description:
    "Browse managed farmland and agricultural land listings across Kerala and the Kerala-Tamil Nadu border.",
  alternates: { canonical: absoluteUrl("/listings") },
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = listingFilterSchema.safeParse(raw);
  const filters = parsed.success ? parsed.data : {};
  const listings = await listPublicListings(filters);

  const inputClass =
    "rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-brand-900 placeholder:text-brand-400 focus:border-brand-500 focus:outline-none";

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-brand-900">Listings</h1>

      <BuyerTypeSelector />

      <form method="get" className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          name="district"
          placeholder="District"
          defaultValue={filters.district ?? ""}
          className={inputClass}
        />
        <select name="landType" defaultValue={filters.landType ?? ""} className={inputClass}>
          <option value="">Any land type</option>
          {LAND_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="minPriceInr"
          placeholder="Min price"
          defaultValue={filters.minPriceInr ?? ""}
          className={inputClass}
        />
        <input
          type="number"
          name="maxPriceInr"
          placeholder="Max price"
          defaultValue={filters.maxPriceInr ?? ""}
          className={inputClass}
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-700 px-5 py-2 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-800"
        >
          Filter
        </button>
      </form>

      {listings.length === 0 ? (
        <p className="mt-10 text-brand-600">No listings match your search.</p>
      ) : (
        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </section>
      )}
    </main>
  );
}
