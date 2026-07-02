"use client";

import { useState } from "react";
import { LeadCaptureSuccess } from "@/components/public/LeadCaptureSuccess";
import { appendLeadQualification, BUDGET_RANGES, VISIT_READINESS } from "@/lib/lead-qualification";

// Standalone "Schedule a Site Visit" form (prj.md Section 3 / lead-capture surfaces).
// Posts as a distinct `site_visit_request` lead type. Project pages deep-link here with
// the project name (and id) pre-filled.
type SiteVisitFormProps = {
  defaultProjectInterest?: string;
  sourceProjectId?: string;
  sourcePage?: string;
};

function makeInitial(projectInterest?: string) {
  return {
    name: "",
    phone: "",
    whatsapp: "",
    preferredDate: "",
    projectInterest: projectInterest ?? "",
    budgetRange: "",
    visitReadiness: "",
    company: "",
  };
}

export function SiteVisitForm({
  defaultProjectInterest,
  sourceProjectId,
  sourcePage,
}: SiteVisitFormProps) {
  const [form, setForm] = useState(() => makeInitial(defaultProjectInterest));
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
        preferredDate: form.preferredDate || undefined,
        projectInterest: form.projectInterest || undefined,
        message: appendLeadQualification(undefined, {
          budgetRange: form.budgetRange,
          visitReadiness: form.visitReadiness,
        }),
        company: form.company,
        leadType: "site_visit_request",
        ...(sourceProjectId ? { sourceProjectId } : {}),
        ...(sourcePage ? { sourcePage } : {}),
      }),
    });
    if (res.ok) {
      setStatus("success");
      setForm(makeInitial(defaultProjectInterest));
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <LeadCaptureSuccess
        testId="site-visit-success"
        title="Site visit request received"
        resetLabel="Send another request"
        onReset={() => setStatus("idle")}
      />
    );
  }

  const fieldClass =
    "w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-brand-900 placeholder:text-brand-400 focus:border-brand-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} data-testid="site-visit-form" className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-brand-900">Schedule a site visit</h2>
      <p className="text-sm text-brand-600">
        We will help you verify the facts on-site: title basics, access, water source, and what
        ongoing management really includes.
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
      <input
        placeholder="WhatsApp number (if different)"
        value={form.whatsapp}
        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        className={fieldClass}
      />
      <label className="text-sm text-brand-600">
        Preferred date
        <input
          type="date"
          value={form.preferredDate}
          onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
          className={`${fieldClass} mt-1`}
        />
      </label>
      <input
        placeholder="Project of interest"
        value={form.projectInterest}
        onChange={(e) => setForm({ ...form, projectInterest: e.target.value })}
        className={fieldClass}
      />
      <select
        value={form.visitReadiness}
        onChange={(e) => setForm({ ...form, visitReadiness: e.target.value })}
        className={fieldClass}
      >
        <option value="">What would help before the visit? (optional)</option>
        {VISIT_READINESS.map((readiness) => (
          <option key={readiness} value={readiness}>
            {readiness}
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
      {/* Honeypot */}
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
        {status === "submitting" ? "Sending..." : "Request site visit"}
      </button>
    </form>
  );
}
