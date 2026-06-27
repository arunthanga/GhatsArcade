// Colour-coded lead status badge for the CRM and dashboard. Colours give an
// at-a-glance read of where each lead sits in the pipeline.
const STATUS_STYLES: Record<string, { className: string; label: string }> = {
  new: { className: "bg-blue-100 text-blue-800", label: "New" },
  contacted: { className: "bg-yellow-100 text-yellow-800", label: "Contacted" },
  site_visit_requested: {
    className: "bg-purple-100 text-purple-800",
    label: "Site visit requested",
  },
  site_visit_scheduled: {
    className: "bg-indigo-100 text-indigo-800",
    label: "Site visit scheduled",
  },
  negotiating: { className: "bg-orange-100 text-orange-800", label: "Negotiating" },
  converted: { className: "bg-green-100 text-green-800", label: "Converted" },
  lost: { className: "bg-slate-200 text-slate-700", label: "Lost" },
};

const FALLBACK = { className: "bg-slate-200 text-slate-700", label: "" };

export function LeadStatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? {
    ...FALLBACK,
    label: status.replace(/_/g, " "),
  };
  const className = [
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    style.className,
  ].join(" ");

  return (
    <span
      data-testid="lead-status-badge"
      data-status={status}
      className={className}
    >
      {style.label}
    </span>
  );
}
