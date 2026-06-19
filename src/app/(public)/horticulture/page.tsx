import type { Metadata } from "next";
import { SiteVisitForm } from "@/components/public/SiteVisitForm";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Horticulture & Plantation",
  description:
    "The crops and trees suited to the Eruthempathy / Palakkad agroclimatic zone, a seasonal harvest calendar, and your options as an owner.",
  alternates: { canonical: absoluteUrl("/horticulture") },
};

const CROPS: { name: string; note: string }[] = [
  { name: "Coconut", note: "A backbone plantation crop — long-lived, steady yield, low fuss." },
  { name: "Banana", note: "Fast-maturing and reliable; good early income while trees establish." },
  { name: "Mango", note: "Premium seasonal fruit well suited to the region's climate." },
  { name: "Jackfruit", note: "Hardy, high-yield, and increasingly valued for fruit and timber." },
  { name: "Pepper", note: "A high-value spice that climbs existing trees — efficient use of land." },
  { name: "Arecanut", note: "A traditional, long-horizon cash crop for the belt." },
  { name: "Timber species", note: "Slow-growing hardwoods that build long-term asset value." },
];

const CALENDAR: { season: string; activity: string }[] = [
  { season: "Pre-monsoon (Apr–May)", activity: "Land prep, planting, and soil enrichment" },
  { season: "Southwest monsoon (Jun–Sep)", activity: "Establishment, weeding, and growth" },
  { season: "Post-monsoon (Oct–Nov)", activity: "Fruit set, spice harvest begins" },
  { season: "Dry season (Dec–Mar)", activity: "Coconut, mango, and main harvests; irrigation-led care" },
];

const OPTIONS: { title: string; body: string }[] = [
  {
    title: "Common-area maintenance",
    body: "The standard plan: the team maintains the estate-wide plantation and shared infrastructure, included in your maintenance fee.",
  },
  {
    title: "Plot-level horticulture management",
    body: "An optional paid add-on for owners who want dedicated cultivation and care of their own plot, with produce rights.",
  },
];

export default function HorticulturePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
          What grows here
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-brand-900">Horticulture & plantation</h1>
        <p className="mt-2 text-lg text-brand-600">
          The Eruthempathy / Palakkad belt is one of South India's most productive zones. Here's
          what thrives on it — and how your land stays productive year-round.
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-brand-900">Crops & trees suited to the zone</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {CROPS.map((crop) => (
            <li key={crop.name} className="rounded-lg border border-brand-100 bg-white p-4">
              <p className="font-medium text-brand-800">{crop.name}</p>
              <p className="mt-1 text-sm text-brand-600">{crop.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-brand-900">Seasonal harvest calendar</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-brand-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50 text-brand-700">
              <tr>
                <th className="px-4 py-2">Season</th>
                <th className="px-4 py-2">On the farm</th>
              </tr>
            </thead>
            <tbody>
              {CALENDAR.map((row) => (
                <tr key={row.season} className="border-t border-brand-100">
                  <td className="px-4 py-2 font-medium text-brand-800">{row.season}</td>
                  <td className="px-4 py-2 text-brand-600">{row.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-brand-500">
          Indicative for the region; exact timing varies by project, crop mix, and the year's
          monsoon.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-brand-900">Your options as an owner</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {OPTIONS.map((option) => (
            <div key={option.title} className="rounded-xl border border-brand-100 bg-white p-6">
              <h3 className="font-semibold text-brand-900">{option.title}</h3>
              <p className="mt-2 text-sm text-brand-700">{option.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* End CTA: site-visit form (prj.md Section 3.4) */}
      <section className="mt-12 rounded-xl border border-brand-100 bg-brand-50 p-6">
        <p className="mb-4 text-brand-700">
          Come see the plantation in person — visit a Ghats Arcade project this weekend.
        </p>
        <SiteVisitForm sourcePage="/horticulture" />
      </section>
    </main>
  );
}
