import type { Metadata } from "next";
import { CallbackForm } from "@/components/public/CallbackForm";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Resale & Exit",
  description:
    "Our commitment to help registered owners resell managed farmland when the time comes — how resale works step by step, why land in this region appreciates, and liquidity reassurance for NRI owners.",
  alternates: { canonical: absoluteUrl("/resale") },
};

const STEPS: { title: string; detail: string }[] = [
  {
    title: "Tell us you'd like to sell",
    detail: "Reach out and let us know your plot and your timeline. There's no lock-in — it's your land to sell whenever you choose.",
  },
  {
    title: "Valuation & listing",
    detail: "We help you arrive at a fair, current market value and prepare a listing with the plot's history, plantation, and documentation.",
  },
  {
    title: "We surface it to demand",
    detail: "Your plot is offered to incoming buyer enquiries and our existing owner network — the same pipeline that fills our projects.",
  },
  {
    title: "Due diligence & paperwork",
    detail: "We support the prospective purchaser's due diligence with the title, encumbrance, and survey records we already maintain for the project.",
  },
  {
    title: "Transfer & registration",
    detail: "We walk both sides through the sale deed and sub-registrar process, just as we did when you first registered.",
  },
];

const APPRECIATION: { title: string; body: string }[] = [
  {
    title: "A finite, fertile belt",
    body: "Productive, water-rich land in the Palakkad zone is limited. Scarcity in a desirable region supports value over the long term.",
  },
  {
    title: "Infrastructure is growing",
    body: "Roads, connectivity, and development around the region continue to improve, drawing demand toward well-located farmland.",
  },
  {
    title: "Managed land stays valuable",
    body: "A maintained, cultivated, clear-title plot in an active estate is far easier to sell than a neglected, isolated field.",
  },
  {
    title: "Proximity to a metro",
    body: "Closeness to Coimbatore — airport, hospitals, and rail — keeps the area attractive to the next wave of buyers.",
  },
];

export default function ResalePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
          Thinking ahead
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-brand-900">Resale & exit</h1>
        <p className="mt-2 text-lg text-brand-600">
          "Who do I sell to later?" is a fair question — and one we answer before you register. Here's our
          commitment to helping you exit when the time is right.
        </p>
      </header>

      <section className="rounded-xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="text-lg font-semibold text-brand-900">Our commitment</h2>
        <p className="mt-2 leading-relaxed text-brand-800">
          When you decide to sell, you won't be on your own. We are committed to facilitating the
          resale of your plot — drawing on the same buyer demand, documentation, and registration
          know-how that we use for our projects. We can't guarantee a specific price or timeline,
          but we will actively help you find a buyer and complete the transfer cleanly.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-brand-900">How resale works, step by step</h2>
        <ol className="mt-5 space-y-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-xl border border-brand-100 bg-white p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-brand-50">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-brand-800">{step.title}</h3>
                <p className="mt-1 text-sm text-brand-600">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-brand-900">Why land here appreciates</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {APPRECIATION.map((item) => (
            <div key={item.title} className="rounded-xl border border-brand-100 bg-white p-5">
              <h3 className="font-semibold text-brand-800">{item.title}</h3>
              <p className="mt-1 text-sm text-brand-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-brand-100 bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-900">Liquidity reassurance for NRI owners</h2>
        <p className="mt-2 leading-relaxed text-brand-700">
          Selling property from abroad can feel daunting, but you don't need to fly down to make it
          happen. We coordinate viewings, paperwork, and buyer due diligence locally on your behalf,
          and the sale can be completed through a registered power of attorney where appropriate.
          Take independent legal advice on your specific situation — and lean on us for the
          on-the-ground work.
        </p>
      </section>

      {/* End CTA: scheduled call to discuss exit options */}
      <section className="mt-10 rounded-xl border border-brand-100 bg-brand-50 p-6">
        <CallbackForm
          heading="Planning your exit? Let's talk it through."
          blurb="Choose a comfortable call time to discuss your plot, current demand, and the resale process — no obligation."
          submitLabel="Schedule a call"
          sourcePage="/resale"
        />
      </section>
    </main>
  );
}
