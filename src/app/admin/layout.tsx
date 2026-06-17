// Auth-gated CRM shell. TODO: enforce session + role guard here (Better Auth session +
// src/lib/roles.ts), redirecting unauthenticated users to /admin/login.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="admin-shell">
      <nav>{/* TODO: admin navigation */}</nav>
      {children}
    </div>
  );
}
