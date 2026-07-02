import type { Metadata } from "next";
import { LeadMagnetGate } from "@/components/public/LeadMagnetGate";
import { absoluteUrl } from "@/lib/seo";
import { listActiveLeadMagnets } from "@/server/lead-magnets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free Guides",
  description:
    "Download free guides on managed farmland, legal due diligence, and life on the Kerala–Tamil Nadu border for farmland buyers and owners.",
  alternates: { canonical: absoluteUrl("/resources") },
};

export default async function ResourcesPage() {
  const magnets = await listActiveLeadMagnets();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-brand-900">Free Guides</h1>
      <p className="mt-2 text-brand-700">
        Practical, no-jargon guides to help you make a confident decision. Each one is free - just
        tell us where to send it.
      </p>

      {magnets.length === 0 ? (
        <p className="mt-10 text-brand-600">No guides available right now. Check back soon.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {magnets.map((magnet) => (
            <LeadMagnetGate
              key={magnet.id}
              id={magnet.id}
              title={magnet.title}
              sourcePage="/resources"
            />
          ))}
        </div>
      )}
    </main>
  );
}
