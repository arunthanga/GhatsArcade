import type { Metadata } from "next";
import { CallbackForm } from "@/components/public/CallbackForm";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "What is Managed Farmland?",
  description:
    "A plain-English explanation of managed farmland: what you own, what the team does, what you experience as an owner — and who it is honestly not suitable for.",
  alternates: { canonical: absoluteUrl("/what-is-managed-farmland") },
};

const TEAM_DOES = [
  "Soil preparation, planting, and crop care across the estate",
  "Irrigation and water management suited to the Palakkad zone",
  "Common-area upkeep — roads, fencing, clubhouse, shared infrastructure",
  "Plantation management and (optionally) plot-level horticulture as a paid add-on",
  "Coordinating harvests and keeping owners updated",
];

const YOU_EXPERIENCE = [
  "Clear, registered ownership of a demarcated plot in your name",
  "Land that stays productive without you living on-site",
  "A weekend retreat and a tangible, appreciating asset",
  "The produce and the lifestyle — without the daily labour",
];

const NOT_SUITABLE = [
  "You need guaranteed, short-term financial returns.",
  "You expect to build a permanent home on the plot right away.",
  "You want a highly liquid asset you can exit at a moment's notice.",
  "You're not comfortable with a long ownership horizon.",
];

export default function WhatIsManagedFarmlandPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
          The model, explained
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-brand-900">What is managed farmland?</h1>
        <p className="mt-2 text-lg text-brand-600">
          You own the land. A professional team grows on it. You get the produce, the lifestyle, and
          a real asset — without having to farm it yourself.
        </p>
      </header>

      <section className="space-y-4 leading-relaxed text-brand-800">
        <p>
          Owning farmland used to mean either living on it or watching it sit idle. Managed farmland
          removes that trade-off. You buy a clearly demarcated, registered plot of agricultural
          land, and an on-ground team handles the cultivation and upkeep on your behalf — so the
          land stays alive and productive whether you visit every weekend or once a year.
        </p>
        <p>
          It's a model built for people whose time and home are elsewhere — busy professionals, NRIs
          working in the Gulf, families who want a productive legacy — but who still want the
          grounding, the produce, and the long-term value of real agricultural land.
        </p>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-brand-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-900">What the team does</h2>
          <ul className="mt-3 space-y-2 text-sm text-brand-700">
            {TEAM_DOES.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-brand-500">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-brand-900">What you experience</h2>
          <ul className="mt-3 space-y-2 text-sm text-brand-700">
            {YOU_EXPERIENCE.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-brand-500">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Honest credibility signal (prj.md Section 3.4) */}
      <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-lg font-semibold text-amber-900">
          Who managed farmland is honestly not for
        </h2>
        <p className="mt-1 text-sm text-amber-800">
          We'd rather you walk away informed than buy something that doesn't fit. This may not be
          right for you if:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-amber-900">
          {NOT_SUITABLE.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border border-brand-100 bg-brand-50 p-6">
        <CallbackForm
          heading="Still have questions? Our team can answer them on a 10-minute call."
          blurb="Leave your name and number — no pressure, no sales script. Just answers."
          submitLabel="Request a callback"
          sourcePage="/what-is-managed-farmland"
        />
      </section>
    </main>
  );
}
