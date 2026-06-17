import { AdminManager } from "@/components/admin/AdminManager";
import { requirePermission } from "@/server/session";

export default async function AdminAccountsPage() {
  // OWNER-only: redirects non-Owners to the dashboard (prj.md Section 9).
  await requirePermission("admin:add");
  return (
    <main>
      <h1>Manage Admins</h1>
      <AdminManager />
    </main>
  );
}
