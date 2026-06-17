import { requireUser } from "@/server/session";

export default async function AdminDashboardPage() {
  const user = await requireUser();
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Signed in as {user.email} ({user.role}).</p>
      {/* TODO: summary of listings, leads, recent activity */}
    </main>
  );
}
