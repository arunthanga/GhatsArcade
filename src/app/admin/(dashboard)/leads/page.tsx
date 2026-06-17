import { LeadManager } from "@/components/admin/LeadManager";
import { listLeads } from "@/server/leads";
import { requirePermission } from "@/server/session";

export default async function AdminLeadsPage() {
  const user = await requirePermission("lead:view");
  const leads = await listLeads({ actorRole: user.role });

  return (
    <main>
      <h1>Leads / CRM</h1>
      <LeadManager
        initialLeads={leads.map((lead) => ({
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          buyerType: lead.buyerType,
          status: lead.status,
          sourceTitle: lead.sourceListing?.title ?? null,
          notes: lead.followUpNotes.map((note) => ({
            id: note.id,
            noteText: note.noteText,
            contactMethod: note.contactMethod,
            authorName: note.author.name,
            createdAt: note.createdAt.toISOString(),
          })),
        }))}
      />
    </main>
  );
}
