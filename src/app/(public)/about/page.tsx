import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: "Why we focus on managed farmland in Kerala and the Kerala-Tamil Nadu border region, and how it works.",
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-brand-900">About Ghats Arcade</h1>

      <section className="mt-6 space-y-4 leading-relaxed text-brand-800">
        <p>
          Ghats Arcade helps people own and grow productive farmland in Kerala and along the
          Kerala-Tamil Nadu border - one of South India&apos;s most fertile and scenic regions.
        </p>
        <p>
          We focus on this belt because its climate, soil, and access to water make it well suited
          to long-lived plantation crops, while the surrounding hills offer the tranquility that
          gives our name its meaning.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-brand-900">How it works</h2>
        <ol className="mt-4 space-y-3 text-brand-700">
          <li>
            <span className="font-medium text-brand-900">1. Browse:</span> explore current listings
            with clear pricing, size, and location details.
          </li>
          <li>
            <span className="font-medium text-brand-900">2. Enquire:</span> send us a message and we
            walk you through eligibility, paperwork, and visits.
          </li>
          <li>
            <span className="font-medium text-brand-900">3. Own &amp; grow:</span> we can manage
            cultivation and upkeep so your land stays productive.
          </li>
        </ol>
      </section>
    </main>
  );
}
