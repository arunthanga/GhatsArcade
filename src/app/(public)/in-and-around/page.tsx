import type { Metadata } from "next";
import { SiteVisitForm } from "@/components/public/SiteVisitForm";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "In and Around Eruthempathy",
  description:
    "The hills, forests, dams, and towns near our farmland — Silent Valley, Nelliyampathy, Palakkad Fort, Malampuzha, Dhoni Waterfalls, and Coimbatore — with drive times from site.",
  alternates: { canonical: absoluteUrl("/in-and-around") },
};

const DESTINATIONS: { name: string; distance: string; highlight: string }[] = [
  {
    name: "Silent Valley National Park",
    distance: "~2.5 hrs",
    highlight: "Pristine rainforest and rare wildlife — a bucket-list day trip.",
  },
  {
    name: "Nelliyampathy Hills",
    distance: "~2 hrs",
    highlight: "Tea, orange, and cardamom estates with cool, misty viewpoints.",
  },
  {
    name: "Palakkad Fort",
    distance: "~1 hr",
    highlight: "The historic Tipu Sultan fort and gardens in the heart of Palakkad town.",
  },
  {
    name: "Malampuzha Dam & Gardens",
    distance: "~1 hr",
    highlight: "Boating, ropeway, and landscaped gardens below the Western Ghats.",
  },
  {
    name: "Dhoni Waterfalls",
    distance: "~1 hr",
    highlight: "A scenic forest trek to a cool cascade — best after the monsoon.",
  },
  {
    name: "Attappady",
    distance: "~1.5 hrs",
    highlight: "Tribal heartland with valleys, rivers, and unspoiled landscapes.",
  },
  {
    name: "Coimbatore city",
    distance: "~1.5 hrs",
    highlight: "The nearest metro — airport, hospitals, malls, and rail connectivity.",
  },
];

export default function InAndAroundPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
          The region
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-brand-900">In and around Eruthempathy</h1>
        <p className="mt-2 text-lg text-brand-600">
          Your land isn't a remote field — it's the centre of a region full of hills, forests, and
          weekends worth having. Here's what's nearby.
        </p>
      </header>

      <section className="space-y-4">
        {DESTINATIONS.map((place) => (
          <div
            key={place.name}
            className="flex items-start justify-between gap-4 rounded-xl border border-brand-100 bg-white p-5"
          >
            <div>
              <h2 className="font-semibold text-brand-900">{place.name}</h2>
              <p className="mt-1 text-sm text-brand-600">{place.highlight}</p>
            </div>
            <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              {place.distance}
            </span>
          </div>
        ))}
      </section>

      <p className="mt-4 text-xs text-brand-500">
        Drive times are approximate and depend on the specific project and road conditions. Exact
        distances are listed on each project page.
      </p>

      {/* End CTA: site-visit form (prj.md Section 3.4) */}
      <section className="mt-12 rounded-xl border border-brand-100 bg-brand-50 p-6">
        <p className="mb-4 text-brand-700">
          Visit the land and explore the region — schedule a site visit and make a weekend of it.
        </p>
        <SiteVisitForm sourcePage="/in-and-around" />
      </section>
    </main>
  );
}
