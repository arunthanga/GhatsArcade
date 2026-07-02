import type { Metadata } from "next";
import Link from "next/link";
import { LeadMagnetGate } from "@/components/public/LeadMagnetGate";
import { absoluteUrl } from "@/lib/seo";
import { listActiveLeadMagnets } from "@/server/lead-magnets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Why Farmland for Your Family?",
  description:
    "Land appreciation, investment security, investment growth, peaceful living, and legacy — why managed farmland in the Kerala-Tamil Nadu border region fits families and co-farmers with a long view.",
  alternates: { canonical: absoluteUrl("/why-invest") },
};

const PILLARS = [
  {
    title: "Investment growth",
    body: "Productive land in a fertile, water-rich belt is a finite asset. As infrastructure and demand grow around the Palakkad region, well-chosen farmland can support long-term investment growth for families with patience.",
  },
  {
    title: "Investment security",
    body: "Investment security begins with clean titles, documented access, clear land classification, and a trusted developer who explains what is verified before you visit.",
  },
  {
    title: "Peaceful living",
    body: "A farm can be your family's weekend home in spirit — a calm vacation home rhythm without pretending agricultural land is a residential plot.",
  },
  {
    title: "Legacy",
    body: "Land is the asset families pass down. A managed, organic-living plantation keeps that legacy productive instead of idle — something your children inherit with life, not upkeep headaches.",
  },
];

const PROFILES = [
  "The Gulf NRI co-farmer who wants a rooted asset back home, managed while they're away.",
  "The salaried professional diversifying beyond stocks, FDs, and an apartment.",
  "The doctor or consultant with surplus income and no time to manage land.",
  "The parent building an inheritance their children will actually thank them for.",
  "The retiree who wants a productive, low-volatility asset and a peaceful weekend retreat.",
  "The returning NRI planning a slower, land-connected second innings.",
  "The first-time co-farmer who wants the upside without the title-fraud horror stories.",
  "The business owner balancing a market-heavy portfolio with something tangible.",
  "The wellness-minded family who wants chemical-aware produce they can trust.",
  "The legacy-minded family consolidating wealth into a generational asset.",
  "The diaspora co-farmer who wants a foothold in their home state.",
  "The cautious saver who values appreciation they can see and walk on.",
  "The hobby-farmer-at-heart who wants the land without the daily labour.",
  "The long-horizon family who measures returns in decades, not quarters.",
];

export default async function WhyInvestPage() {
  const magnets = await listActiveLeadMagnets();
  const magnet = magnets[0];

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
          For families with a long view
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-brand-900">
          Why farmland for your family?
        </h1>
        <p className="mt-2 text-lg text-brand-600">
          Investment security, investment growth, peaceful living, and legacy — in one clean-title
          asset your family can stand on together.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="rounded-xl border border-brand-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-900">{pillar.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-700">{pillar.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-brand-900">Does one of these sound like you?</h2>
        <p className="mt-1 text-sm text-brand-600">
          Co-farmers don't fit one mould. Most share a long view and a wish for something real.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {PROFILES.map((profile) => (
            <li
              key={profile}
              className="rounded-lg border border-brand-100 bg-white p-4 text-sm text-brand-700"
            >
              {profile}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        {magnet ? (
          <LeadMagnetGate id={magnet.id} title={magnet.title} sourcePage="/why-invest" />
        ) : (
          <div className="rounded-xl border border-brand-100 bg-brand-50 p-6">
            <h2 className="text-lg font-semibold text-brand-900">
              Download our free guide before you visit
            </h2>
            <p className="mt-1 text-sm text-brand-700">
              "7 things to verify before registering agricultural land in Kerala" — and more
              practical guides on our resources page.
            </p>
            <Link
              href="/resources"
              className="mt-4 inline-block rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-800"
            >
              Browse free guides
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
