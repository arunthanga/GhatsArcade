"use client";

import { useState } from "react";

// Low-friction, 3-field capture for the project detail page, placed right after the
// plot grid (prj.md Section 3.1). Framed as "hold a plot for 48h", not "sign up".
type PlotHoldFormProps = {
  sourceProjectId: string;
  projectInterest: string;
  sourcePage?: string;
};

const initial = { name: "", phone: "", plotInterest: "", company: "" };

export function PlotHoldForm({ sourceProjectId, projectInterest, sourcePage }: PlotHoldFormProps) {
  const [form, setForm] = useState(initial);
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
        plotInterest: form.plotInterest || undefined,
        company: form.company,
        leadType: "inquiry",
        projectInterest,
        sourceProjectId,
        ...(sourcePage ? { sourcePage } : {}),
      }),
    });
    if (res.ok) {
      setStatus("success");
      setForm(initial);
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p data-testid="plot-hold-success" className="text-brand-800">
        Done - we'll hold a plot and call you within 48 hours.
      </p>
    );
  }

  const fieldClass =
    "w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-brand-900 placeholder:text-brand-400 focus:border-brand-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} data-testid="plot-hold-form" className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-brand-900">Hold a plot for 48 hours</h3>
      <p className="text-sm text-brand-600">
        No payment now. Leave your number and the plot you like - we'll hold it and call you.
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
        placeholder="Which plot or size? (optional)"
        value={form.plotInterest}
        onChange={(e) => setForm({ ...form, plotInterest: e.target.value })}
        className={fieldClass}
      />
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
        {status === "submitting" ? "Sending..." : "Hold my plot"}
      </button>
    </form>
  );
}
