import type { Metadata } from "next";
import { SiteVisitForm } from "@/components/public/SiteVisitForm";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: 'What "Managed" Means',
  description:
    "Exactly what the management service includes and excludes — the maintenance fee, escalation policy, and the path to community association handover. No vague language.",
  alternates: { canonical: absoluteUrl("/what-managed-means") },
};

const INCLUDED = [
  "Cultivation of the plantation — soil care, planting, pruning, pest and disease management",
  "Irrigation and water-system upkeep across the estate",
  "Common-area maintenance: internal roads, fencing, drainage, and shared infrastructure",
  "Security and general supervision of the estate",
  "Periodic updates to owners and coordination of harvests",
];

const EXCLUDED = [
  "Personal construction or structures on individual plots",
  "Statutory dues payable by the owner (e.g. land tax in your name)",
  "Optional plot-level horticulture beyond the common plan (available as a paid add-on)",
  "One-off requests outside the standard maintenance scope",
];

export default function WhatManagedMeansPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
          Scope, defined
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-brand-900">What "managed" means</h1>
        <p className="mt-2 text-lg text-brand-600">
          "Managed" should never be vague. Here's precisely what the service covers, what it
          doesn't, and how the fee and handover work.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-brand-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-900">Included scope</h2>
          <ul className="mt-3 space-y-2 text-sm text-brand-700">
            {INCLUDED.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-brand-600">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-900">Excluded scope</h2>
          <ul className="mt-3 space-y-2 text-sm text-brand-700">
            {EXCLUDED.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-brand-400">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 space-y-6">
        <div className="rounded-xl border border-brand-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-900">The maintenance fee</h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-700">
            A transparent, recurring maintenance fee funds the work above. It's disclosed upfront on
            each project — land price + maintenance fee + registration charges, with no hidden
            extras.
          </p>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-900">Escalation policy</h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-700">
            Any periodic revision to the maintenance fee is defined in your agreement, so increases
            are predictable rather than arbitrary.
          </p>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-900">Association handover</h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-700">
            Over time, ownership of common-area governance can transition to an association of plot owners. The timeline and process for that handover are defined per project, so the
            community can eventually steward its own estate.
          </p>
        </div>
      </section>

      {/* End CTA: site-visit form (prj.md Section 3.4) */}
      <section className="mt-12 rounded-xl border border-brand-100 bg-brand-50 p-6">
        <p className="mb-4 text-brand-700">
          The best way to understand the service is to see the team at work. Schedule a visit and
          watch what "managed" actually looks like on the ground.
        </p>
        <SiteVisitForm sourcePage="/what-managed-means" />
      </section>
    </main>
  );
}
