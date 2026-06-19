import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Who Should Buy Managed Farmland?",
  description:
    "Six kinds of people who tend to thrive as managed-farmland owners — from Gulf NRIs to legacy-minded families. See which one sounds like you.",
  alternates: { canonical: absoluteUrl("/who-should-buy") },
};

const PROFILES: { title: string; body: string }[] = [
  {
    title: "The Gulf NRI",
    body: "You've built savings abroad and want to put down roots back home — a real, productive asset that someone trustworthy looks after while you're away. Farmland gives you that anchor without needing you on the ground.",
  },
  {
    title: "The diversifying professional",
    body: "Your money is in equities, mutual funds, and maybe an apartment. You want something tangible and uncorrelated that balances the volatility — land you can stand on and pass down.",
  },
  {
    title: "The legacy-minded parent",
    body: "You're thinking past your own lifetime. You want to leave your children an asset that appreciates and stays productive — not a maintenance burden, but a managed plantation that keeps giving.",
  },
  {
    title: "The retiree seeking calm",
    body: "You want a low-volatility, real asset and a peaceful weekend retreat in the hills — the grounding of farmland without the labour of farming it yourself.",
  },
  {
    title: "The wellness-conscious buyer",
    body: "You care where your food comes from. Owning a managed plot means produce you can trust and a tangible connection to the land — on your terms, on your schedule.",
  },
  {
    title: "The cautious first-time land buyer",
    body: "You like the idea of land but you've read the horror stories — unclear titles, encroachment, paperwork you don't understand. You want the upside with the due diligence already done and documented.",
  },
];

export default function WhoShouldBuyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
          Is this you?
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-brand-900">
          Who should buy managed farmland?
        </h1>
        <p className="mt-2 text-lg text-brand-600">
          Our owners don't fit one mould — but most see themselves in one of these. Read on and see
          which one feels like you.
        </p>
      </header>

      <div className="space-y-6">
        {PROFILES.map((profile) => (
          <section key={profile.title} className="rounded-xl border border-brand-100 bg-white p-6">
            <h2 className="text-xl font-semibold text-brand-900">{profile.title}</h2>
            <p className="mt-2 leading-relaxed text-brand-700">{profile.body}</p>
            <Link
              href="/contact#site-visit"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900"
            >
              Does this sound like you? Schedule a site visit →
            </Link>
          </section>
        ))}
      </div>
    </main>
  );
}
