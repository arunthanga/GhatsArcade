import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/public/FaqList";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQ_ITEMS } from "@/lib/faq-data";
import { absoluteUrl, faqPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Straight answers about managed farmland ownership in Kerala: titles, NRI eligibility, construction, water, maintenance, resale, and the registration process.",
  alternates: { canonical: absoluteUrl("/faq") },
};

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={faqPageJsonLd(FAQ_ITEMS)} />

      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-brand-900">Frequently asked questions</h1>
        <p className="mt-2 text-brand-700">
          The questions buyers ask us most — answered plainly. Still unsure about something? We're
          happy to talk it through.
        </p>
      </header>

      <FaqList items={FAQ_ITEMS} />

      <section className="mt-10 rounded-xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="text-lg font-semibold text-brand-900">Didn't find your answer?</h2>
        <p className="mt-1 text-sm text-brand-700">
          Send us your question and we'll get back to you — or schedule a visit to see a project in
          person.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-800"
          >
            Ask us a question
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-brand-200 px-5 py-2.5 text-sm font-medium text-brand-800 transition-colors hover:bg-white"
          >
            Schedule a site visit
          </Link>
        </div>
      </section>
    </main>
  );
}
