import type { Metadata } from "next";
import Link from "next/link";
import { RegistrationSteps } from "@/components/public/RegistrationSteps";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { publicEnv } from "@/lib/env";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Legal Checklist & Due Diligence",
  description:
    "Clean titles and legal due diligence for farmland buyers — title history, encumbrance, boundary, survey, road access, classification, and registration process.",
  alternates: { canonical: absoluteUrl("/legal-checklist") },
};

const CHECKS: { title: string; body: string }[] = [
  {
    title: "Clean title history",
    body: "We trace the chain of ownership to support clean titles and confirm the seller has a clear, marketable title with no breaks or disputes in the record.",
  },
  {
    title: "Encumbrance certificate",
    body: "We obtain the EC to confirm the land is free of mortgages, liens, or other registered charges over the relevant period.",
  },
  {
    title: "Boundary & survey",
    body: "Survey numbers and physical boundaries are verified against revenue records so the plot you register is exactly the plot on paper.",
  },
  {
    title: "Road access",
    body: "We confirm legal, usable access to each plot — not just a path on a map — and document the road status on the project page.",
  },
  {
    title: "Land classification",
    body: "We review the revenue classification of the land so you know precisely what you're registering for and what is (and isn't) permitted on it.",
  },
];

export default function LegalChecklistPage() {
  const whatsappNumber = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
          Due diligence, in the open
        </span>
        <h1 className="mt-3 text-3xl font-semibold text-brand-900">Legal checklist</h1>
        <p className="mt-2 text-lg text-brand-600">
          The horror stories about registering land in India are almost always about skipped due
          diligence. Here's exactly what we verify before a project ever goes live, so investment
          security begins with documents, not promises.
        </p>
      </header>

      <section className="space-y-4">
        {CHECKS.map((check) => (
          <div key={check.title} className="rounded-xl border border-brand-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-900">{check.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-700">{check.body}</p>
          </div>
        ))}
      </section>

      <p className="mt-6 text-sm text-brand-600">
        Each project page carries its own legal checklist section documenting what was verified for
        that specific land. We encourage every prospective buyer — especially NRIs — to review the documents and
        take independent legal advice before committing. That is what a trusted developer should make
        easy, not avoid.
      </p>

      <div className="mt-12">
        <RegistrationSteps />
      </div>

      {/* End CTA: WhatsApp deep-link with a pre-filled message (prj.md Section 3.4) */}
      <section className="mt-2 rounded-xl border border-brand-100 bg-brand-50 p-6">
        <h2 className="text-lg font-semibold text-brand-900">
          Want to review the documents for a specific project before visiting?
        </h2>
        <p className="mt-1 text-sm text-brand-700">
          Ask us — we'll share the relevant title, encumbrance, and survey paperwork so you can do
          your own due diligence first.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {whatsappNumber ? (
            <WhatsAppButton
              phone={whatsappNumber}
              message="I'd like to review the legal documents for a project before my visit."
              label="Ask on WhatsApp"
              className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-800"
            />
          ) : null}
          <Link
            href="/contact"
            className="rounded-lg border border-brand-200 px-5 py-2.5 text-sm font-medium text-brand-800 transition-colors hover:bg-white"
          >
            Or send us a message
          </Link>
        </div>
      </section>
    </main>
  );
}
