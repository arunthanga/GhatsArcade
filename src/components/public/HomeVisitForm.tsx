"use client";

import { useState } from "react";

// Block 8 — first home-page lead capture (prj.md Section 3.1): "Schedule a Visit".
// Deliberately low-friction: Name, Phone, WhatsApp (consent pre-ticked), Project interest.
// No email at this stage. Posts as a `site_visit_request` lead from sourcePage "/".
type HomeVisitFormProps = {
  projects: string[];
};

const makeInitial = () => ({
  name: "",
  phone: "",
  whatsapp: "",
  projectInterest: "",
  whatsappConsent: true,
  company: "",
});

export function HomeVisitForm({ projects }: HomeVisitFormProps) {
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
        whatsapp: form.whatsappConsent ? form.whatsapp || form.phone : undefined,
        projectInterest: form.projectInterest || undefined,
        company: form.company,
        leadType: "site_visit_request",
        sourcePage: "/",
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
      <p data-testid="home-visit-success" className="text-brand-800">
        Thanks — we have your details and will reach out to set up your visit.
      </p>
    );
  }

  const fieldClass =
    "w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-brand-900 placeholder:text-brand-400 focus:border-brand-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} data-testid="home-visit-form" className="flex flex-col gap-3">
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
      <select
        value={form.projectInterest}
        onChange={(e) => setForm({ ...form, projectInterest: e.target.value })}
        className={fieldClass}
      >
        <option value="">Which project interests you? (optional)</option>
        {projects.map((title) => (
          <option key={title} value={title}>
            {title}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-xs text-brand-600">
        <input
          type="checkbox"
          checked={form.whatsappConsent}
          onChange={(e) => setForm({ ...form, whatsappConsent: e.target.checked })}
        />
        It's OK to contact me on WhatsApp.
      </label>
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
        {status === "submitting" ? "Sending..." : "Schedule my visit"}
      </button>
    </form>
  );
}
