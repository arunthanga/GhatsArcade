import Link from "next/link";
import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { prisma } from "@/lib/db";
import { requireUser } from "@/server/session";

export const dynamic = "force-dynamic";

function MetricCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-700 bg-slate-800/40 p-5 transition-colors hover:border-emerald-600"
    >
      <p className="text-3xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const user = await requireUser();

  const [
    leadsByStatus,
    publishedListings,
    publishedBlogPosts,
    projects,
    totalListings,
    leadMagnets,
    totalLeads,
    recentLeads,
  ] = await Promise.all([
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.listing.count({ where: { status: "published" } }),
    prisma.blogPost.count({ where: { status: "published" } }),
    prisma.project.count(),
    prisma.listing.count(),
    prisma.leadMagnetAsset.count(),
    prisma.lead.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        phone: true,
        leadType: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const leadCountByStatus = (status: string) =>
    leadsByStatus.find((row) => row.status === status)?._count._all ?? 0;
  const newLeads = leadCountByStatus("new");
  const negotiatingLeads = leadCountByStatus("negotiating");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-slate-400">
          Signed in as {user.email} ({user.role}).
        </p>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Published listings" value={publishedListings} href="/admin/listings" />
        <MetricCard label="New leads" value={newLeads} href="/admin/leads" />
        <MetricCard label="Leads in negotiation" value={negotiatingLeads} href="/admin/leads" />
        <MetricCard label="Blog posts live" value={publishedBlogPosts} href="/admin/blog" />
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Total leads" value={totalLeads} href="/admin/leads" />
        <MetricCard label="Projects" value={projects} href="/admin/projects" />
        <MetricCard label="All listings" value={totalListings} href="/admin/listings" />
        <MetricCard label="Lead magnets" value={leadMagnets} href="/admin/lead-magnets" />
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Latest leads</h2>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-slate-400">No leads yet.</p>
        ) : (
          <ul className="divide-y divide-slate-700">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-white">{lead.name}</p>
                  <p className="text-slate-400">
                    {lead.phone} &middot; {lead.leadType.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="text-right">
                  <LeadStatusBadge status={lead.status} />
                  <p className="mt-1 text-xs text-slate-500">
                    {lead.createdAt.toLocaleDateString("en-IN")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
