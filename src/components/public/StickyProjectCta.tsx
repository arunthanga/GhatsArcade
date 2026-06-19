import Link from "next/link";

// Sticky bottom CTA shown on small screens only (prj.md Section 3.1: "Ask them to act
// (sticky CTA + inquiry form)"). On larger screens the inline CTA section is enough.
export function StickyProjectCta({
  title,
  projectId,
  remaining,
}: {
  title: string;
  projectId: string;
  remaining: number;
}) {
  const href = `/contact?project=${encodeURIComponent(title)}&projectId=${projectId}`;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-900">{title}</p>
          <p className="text-xs text-brand-600">
            {remaining > 0 ? `${remaining} plots remaining` : "Currently sold out"}
          </p>
        </div>
        <Link
          href={href}
          className="shrink-0 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-brand-50"
        >
          Book a visit
        </Link>
      </div>
    </div>
  );
}
