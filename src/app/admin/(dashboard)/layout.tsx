import { AdminNav, type AdminNavLink } from "@/components/admin/AdminNav";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { can } from "@/lib/roles";
import { requireUser } from "@/server/session";

// The admin "Control Room" — a dark, sidebar-driven shell that is deliberately nothing
// like the public marketing site. Guards every admin page: unauthenticated users are
// redirected to /admin/login (that page lives outside this group, so no redirect loop).
// The public website has no login surface at all; admin is reached directly via /admin.
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  const links: AdminNavLink[] = [
    { href: "/admin/dashboard", label: "Overview" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/horticulture", label: "Horticulture Log" },
    { href: "/admin/listings", label: "Listings" },
    { href: "/admin/leads", label: "Leads / CRM" },
    { href: "/admin/blog", label: "Blog" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/testimonials", label: "Testimonials" },
    { href: "/admin/lead-magnets", label: "Lead Magnets" },
    { href: "/admin/media", label: "Media Library" },
    ...(can(user.role, "admin:add") ? [{ href: "/admin/admins", label: "Admins" }] : []),
    ...(can(user.role, "data:export") ? [{ href: "/admin/export", label: "Export" }] : []),
  ];

  return (
    <div data-testid="admin-shell" className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="flex flex-col gap-6 border-b border-slate-800 bg-slate-900 p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
              Ghats Arcade
            </p>
            <p className="text-lg font-semibold text-white">Control Room</p>
          </div>
          <AdminNav links={links} />
          <div className="mt-auto border-t border-slate-800 pt-4">
            <p className="truncate text-xs text-slate-400" data-testid="current-user">
              {user.email}
            </p>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-emerald-500">
              {user.role}
            </p>
            <SignOutButton />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
