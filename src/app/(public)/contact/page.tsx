import type { Metadata } from "next";
import { LeadInquiryForm } from "@/components/public/LeadInquiryForm";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { publicEnv } from "@/lib/env";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about managed farmland and agricultural land opportunities.",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  const whatsappNumber = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return (
    <main>
      <h1>Contact</h1>
      {whatsappNumber ? <WhatsAppButton phone={whatsappNumber} /> : null}
      {/* TODO: address, hours, map (prj.md Section 3) */}
      <LeadInquiryForm />
    </main>
  );
}
