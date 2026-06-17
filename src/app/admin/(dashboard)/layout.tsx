import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { can } from "@/lib/roles";
import { requireUser } from "@/server/session";

// Guards all admin pages: unauthenticated users are redirected to /admin/login.
// The login page lives outside this route group, so there is no redirect loop.
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const canManageAdmins = can(user.role, "admin:add");
  const canExport = can(user.role, "data:export");

  return (
    <div data-testid="admin-shell">
      <nav>
        <Link href="/admin/dashboard">Dashboard</Link>
        <Link href="/admin/listings">Listings</Link>
        <Link href="/admin/leads">Leads</Link>
        <Link href="/admin/blog">Blog</Link>
        {canManageAdmins ? <Link href="/admin/admins">Admins</Link> : null}
        {canExport ? <Link href="/admin/export">Export</Link> : null}
        <span data-testid="current-user">{user.email}</span>
        <SignOutButton />
      </nav>
      {children}
    </div>
  );
}
