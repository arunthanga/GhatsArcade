import type { Metadata } from "next";
import Link from "next/link";
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
  const activeFilters = [
    filters.district ? `District: ${filters.district}` : null,
    filters.landType ? `Land type: ${filters.landType}` : null,
    filters.minPriceInr !== undefined
      ? `From ${filters.minPriceInr.toLocaleString("en-IN")} INR`
      : null,
    filters.maxPriceInr !== undefined
      ? `Up to ${filters.maxPriceInr.toLocaleString("en-IN")} INR`
      : null,
    filters.minAcres !== undefined ? `From ${filters.minAcres} acres` : null,
    filters.maxAcres !== undefined ? `Up to ${filters.maxAcres} acres` : null,
    filters.keralaTnBorder ? "Kerala-Tamil Nadu border" : null,
  ].filter((filter): filter is string => Boolean(filter));
  const resultLabel = `${listings.length} ${listings.length === 1 ? "listing" : "listings"} found`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Listings</h1>
          <p className="mt-2 max-w-2xl text-brand-700">
            Narrow your search by place, budget, land type, and acreage before you schedule a visit.
          </p>
        </div>
        <p className="text-sm font-medium text-brand-700">{resultLabel}</p>
      </div>

      <BuyerTypeSelector />

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
              placeholder="Idukki"
              defaultValue={filters.district ?? ""}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-brand-700">
            Land type
            <select name="landType" defaultValue={filters.landType ?? ""} className={inputClass}>
              <option value="">Any land type</option>
              {LAND_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-brand-700">
            Min price
            <input
              type="number"
              name="minPriceInr"
              placeholder="5000000"
              defaultValue={filters.minPriceInr ?? ""}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-brand-700">
            Max price
            <input
              type="number"
              name="maxPriceInr"
              placeholder="10000000"
              defaultValue={filters.maxPriceInr ?? ""}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-brand-700">
            Min acreage
            <input
              type="number"
              name="minAcres"
              step="0.1"
              placeholder="1"
              defaultValue={filters.minAcres ?? ""}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-brand-700">
            Max acreage
            <input
              type="number"
              name="maxAcres"
              step="0.1"
              placeholder="5"
              defaultValue={filters.maxAcres ?? ""}
              className={inputClass}
            />
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-sm font-medium text-brand-800 lg:col-span-2 lg:self-end">
            <input
              type="checkbox"
              name="keralaTnBorder"
              value="true"
              defaultChecked={filters.keralaTnBorder ?? false}
              className="h-4 w-4 accent-brand-700"
            />
            Kerala-Tamil Nadu border only
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-brand-700 px-5 py-2 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-800"
          >
            Show listings
          </button>
          {activeFilters.length > 0 ? (
            <Link
              href="/listings"
              className="text-sm font-medium text-brand-700 hover:text-brand-900"
            >
              Clear filters
            </Link>
          ) : null}
        </div>
      </form>

      {activeFilters.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Active listing filters">
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

      {listings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-brand-100 bg-white p-6 text-brand-700">
          <p className="font-medium text-brand-900">No listings match your search.</p>
          <p className="mt-1 text-sm">
            Try widening your budget, acreage, or district filters, or contact us for upcoming
            availability.
          </p>
        </div>
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
