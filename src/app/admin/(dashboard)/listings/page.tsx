import { ListingManager } from "@/components/admin/ListingManager";
import { listAllListings } from "@/server/listings";
import { requirePermission } from "@/server/session";

export default async function AdminListingsPage() {
  const user = await requirePermission("listing:manage");
  const listings = await listAllListings({ actorRole: user.role });

  return (
    <main>
      <h1>Manage Listings</h1>
      <ListingManager
        initialListings={listings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          slug: listing.slug,
          district: listing.district,
          status: listing.status,
          priceInr: listing.priceInr,
          sizeAcres: listing.sizeAcres,
        }))}
      />
    </main>
  );
}
