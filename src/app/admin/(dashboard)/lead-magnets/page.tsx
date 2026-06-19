import { LeadMagnetManager } from "@/components/admin/LeadMagnetManager";
import { listAllLeadMagnets } from "@/server/lead-magnets";
import { requirePermission } from "@/server/session";

export default async function AdminLeadMagnetsPage() {
  const user = await requirePermission("leadMagnet:manage");
  const magnets = await listAllLeadMagnets({ actorRole: user.role });

  return (
    <main>
      <h1>Lead Magnets</h1>
      <LeadMagnetManager
        initialMagnets={magnets.map((magnet) => ({
          id: magnet.id,
          title: magnet.title,
          fileUrl: magnet.fileUrl,
          isActive: magnet.isActive,
          downloadCount: magnet.downloadCount,
        }))}
      />
    </main>
  );
}
