import { EXPORT_DATASETS } from "@/server/export";
import { requirePermission } from "@/server/session";

const DATASET_LABELS: Record<(typeof EXPORT_DATASETS)[number], string> = {
  leads: "Leads / CRM",
  listings: "Listings",
  projects: "Projects & plots",
  events: "Events",
};

export default async function AdminExportPage() {
  // OWNER-only: non-Owners are redirected to the dashboard (prj.md Section 9).
  await requirePermission("data:export");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Export data</h1>
        <p className="text-sm text-slate-400">
          Download a CSV snapshot of your data. Only the Owner can access this page.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EXPORT_DATASETS.map((dataset) => (
          <li key={dataset}>
            {/* download attribute hints the browser to save rather than navigate */}
            <a
              href={`/api/export?dataset=${dataset}`}
              download
              className="flex flex-col rounded-xl border border-slate-700 bg-slate-800/40 p-5 transition-colors hover:border-emerald-700 hover:bg-slate-800"
            >
              <span className="text-sm font-semibold text-white">{DATASET_LABELS[dataset]}</span>
              <span className="mt-1 text-xs text-slate-400">Download {dataset}.csv</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
