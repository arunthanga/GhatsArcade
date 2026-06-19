"use client";

import { useState } from "react";

// Low-friction "request a callback" form: Name + Phone only (prj.md Section 3.4 — the
// "What is Managed Farmland?" page ends with a 10-minute-call CTA). Posts as a `callback`
// lead type so the CRM can tell it apart from inquiries and site-visit requests.
type CallbackFormProps = {
  heading?: string;
  blurb?: string;
  submitLabel?: string;
  sourcePage?: string;
};

const initial = { name: "", phone: "", company: "" };

export function CallbackForm({
  heading = "Prefer to talk it through?",
  blurb = "Leave your number and our team will call you back — usually within a working day.",
  submitLabel = "Request a callback",
  sourcePage,
}: CallbackFormProps) {
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
        company: form.company,
        leadType: "callback",
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
      <p data-testid="callback-success" className="text-brand-800">
        Thanks — we have your number and will call you back shortly.
      </p>
    );
  }

  const fieldClass =
    "w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-brand-900 placeholder:text-brand-400 focus:border-brand-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} data-testid="callback-form" className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-brand-900">{heading}</h2>
      <p className="text-sm text-brand-600">{blurb}</p>
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
        {status === "submitting" ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}
