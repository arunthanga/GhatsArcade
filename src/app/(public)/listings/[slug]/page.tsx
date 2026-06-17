export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main>
      <h1>Listing: {slug}</h1>
      {/* TODO: photos, map, price, eligibility disclaimer, inquiry form,
          WhatsApp button, RealEstateListing JSON-LD (prj.md Section 3) */}
    </main>
  );
}
