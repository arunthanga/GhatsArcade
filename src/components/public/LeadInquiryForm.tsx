"use client";

import { useState } from "react";
import { LeadCaptureSuccess } from "@/components/public/LeadCaptureSuccess";
import {
  appendLeadQualification,
  BUDGET_RANGES,
  BUYING_TIMELINES,
} from "@/lib/lead-qualification";
import { BUYER_TYPE_LABELS, BUYER_TYPES } from "@/types";

type LeadInquiryFormProps = {
  heading?: string;
  submitLabel?: string;
  // Source attribution — wired into the lead so the CRM knows where it came from.
  sourceListingId?: string;
  sourceProjectId?: string;
  sourceBlogPostId?: string;
  sourcePage?: string;
  // Pre-fills the "which project/plot" context for project-page forms.
  projectInterest?: string;
  // Whether to ask for a WhatsApp number (high-intent project/contact forms do).
  askWhatsApp?: boolean;
};

function makeInitial() {
  return {
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    buyerType: BUYER_TYPES[0] as string,
    buyingTimeline: "",
    budgetRange: "",
    wantsProofPack: true,
    message: "",
    company: "", // honeypot - must stay empty
  };
}

export function LeadInquiryForm({
  heading = "Enquire about this property",
  submitLabel = "Send enquiry",
  sourceListingId,
  sourceProjectId,
  sourceBlogPostId,
  sourcePage,
  projectInterest,
  askWhatsApp = false,
}: LeadInquiryFormProps) {
  const [form, setForm] = useState(makeInitial);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp || undefined,
        email: form.email || undefined,
        buyerType: form.buyerType,
        message: appendLeadQualification(form.message, {
          buyingTimeline: form.buyingTimeline,
          budgetRange: form.budgetRange,
          wantsProofPack: form.wantsProofPack,
        }),
        company: form.company,
        leadType: "inquiry",
        ...(projectInterest ? { projectInterest } : {}),
        ...(sourcePage ? { sourcePage } : {}),
        ...(sourceListingId ? { sourceListingId } : {}),
        ...(sourceProjectId ? { sourceProjectId } : {}),
        ...(sourceBlogPostId ? { sourceBlogPostId } : {}),
      }),
    });
    if (res.ok) {
      setStatus("success");
      setForm(makeInitial());
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <LeadCaptureSuccess
        testId="inquiry-success"
        title="Enquiry received"
        resetLabel="Send another enquiry"
        onReset={() => setStatus("idle")}
      />
    );
  }

  const fieldClass =
    "w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-brand-900 placeholder:text-brand-400 focus:border-brand-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} data-testid="inquiry-form" className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-brand-900">{heading}</h2>
      <p className="text-sm text-brand-600">
        We can share the project factsheet first — title checklist, land classification, road
        access, water source, and maintenance scope — before asking you to decide anything.
      </p>
      <input
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className={fieldClass}
      />
      <input
        placeholder="Phone (with country code)"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
        className={fieldClass}
      />
      {askWhatsApp ? (
        <input
          placeholder="WhatsApp number (if different)"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          className={fieldClass}
        />
      ) : null}
      <input
        type="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={fieldClass}
      />
      <label className="text-sm text-brand-600">
        Which best describes you?
        <select
          value={form.buyerType}
          onChange={(e) => setForm({ ...form, buyerType: e.target.value })}
          className={`${fieldClass} mt-1`}
        >
          {BUYER_TYPES.map((type) => (
            <option key={type} value={type}>
              {BUYER_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </label>
      <select
        value={form.buyingTimeline}
        onChange={(e) => setForm({ ...form, buyingTimeline: e.target.value })}
        className={fieldClass}
      >
        <option value="">When would you like to join? (optional)</option>
        {BUYING_TIMELINES.map((timeline) => (
          <option key={timeline} value={timeline}>
            {timeline}
          </option>
        ))}
      </select>
      <select
        value={form.budgetRange}
        onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
        className={fieldClass}
      >
        <option value="">Budget range (optional)</option>
        {BUDGET_RANGES.map((range) => (
          <option key={range} value={range}>
            {range}
          </option>
        ))}
      </select>
      <label className="flex items-start gap-2 text-xs leading-relaxed text-brand-600">
        <input
          type="checkbox"
          checked={form.wantsProofPack}
          onChange={(e) => setForm({ ...form, wantsProofPack: e.target.checked })}
          className="mt-0.5"
        />
        Send me the factsheet/proof pack before the sales call.
      </label>
      <textarea
        placeholder="Message (optional)"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={fieldClass}
        rows={4}
      />
      {/* Honeypot: hidden from humans, ignored by the server when filled. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: "none" }}
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />
      {projectInterest ? (
        <p className="text-xs text-brand-500">Regarding: {projectInterest}</p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm text-red-700">
          Something went wrong. Please try again.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-lg bg-brand-700 px-5 py-2.5 font-medium text-brand-50 transition-colors hover:bg-brand-800 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}
