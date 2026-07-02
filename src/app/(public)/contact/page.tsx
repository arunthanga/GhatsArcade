import type { Metadata } from "next";
import { LeadInquiryForm } from "@/components/public/LeadInquiryForm";
import { LocationMap } from "@/components/public/LocationMap";
import { OwnerContactCard } from "@/components/public/OwnerContactCard";
import { SiteVisitForm } from "@/components/public/SiteVisitForm";
import { TrustProofStrip } from "@/components/public/TrustProofStrip";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { publicEnv } from "@/lib/env";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about managed farmland and agricultural land opportunities.",
  alternates: { canonical: absoluteUrl("/contact") },
};

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const projectInterest = firstParam(params.project);
  const sourceProjectId = firstParam(params.projectId);
  const whatsappNumber = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const officeLat = publicEnv.NEXT_PUBLIC_OFFICE_LAT;
  const officeLng = publicEnv.NEXT_PUBLIC_OFFICE_LNG;
  const officeAddress = publicEnv.NEXT_PUBLIC_OFFICE_ADDRESS;
  const hasOfficeMap = officeLat != null && officeLng != null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-brand-900">Contact</h1>
      <p className="mt-2 text-brand-700">
        Book a site visit, ask a question, or request the documents for a specific project. We
        usually reply the same day.
      </p>
      {whatsappNumber ? (
        <div className="mt-4">
          <WhatsAppButton phone={whatsappNumber} label="Chat with us on WhatsApp" />
        </div>
      ) : null}

      <OwnerContactCard />
      <TrustProofStrip className="mt-8 rounded-xl border border-brand-100" compact />

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        <section
          id="site-visit"
          className="scroll-mt-24 rounded-xl border border-brand-100 bg-brand-50 p-6"
        >
          <SiteVisitForm
            defaultProjectInterest={projectInterest}
            sourceProjectId={sourceProjectId}
            sourcePage="/contact"
          />
        </section>
        <section className="rounded-xl border border-brand-100 bg-white p-6">
          <LeadInquiryForm
            heading="Send us a message"
            submitLabel="Send message"
            askWhatsApp
            sourcePage="/contact"
          />
        </section>
      </div>

      {hasOfficeMap || officeAddress ? (
        <section className="mt-12">
          <h2 className="mb-3 text-xl font-semibold text-brand-900">Where to find us</h2>
          {officeAddress ? (
            <address className="mb-4 not-italic text-brand-700">{officeAddress}</address>
          ) : null}
          {hasOfficeMap ? (
            <LocationMap
              latitude={officeLat as number}
              longitude={officeLng as number}
              title={officeAddress ?? "Our location"}
            />
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
