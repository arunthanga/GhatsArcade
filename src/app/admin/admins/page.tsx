export default function AdminAccountsPage() {
  return (
    <main>
      <h1>Manage Admins</h1>
      {/* OWNER-ONLY: add/remove Admin accounts. Guarded by can(role, "admin:add" | "admin:delete").
          The single-Owner invariant must be enforced server-side (prj.md Section 9). */}
    </main>
  );
}
