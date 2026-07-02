"use client";

import { useState } from "react";

// Gated download: collect name + phone (email optional) in exchange for a PDF. On success
// the server returns the file URL, which we reveal as a download link (prj.md Section 3).
type LeadMagnetGateProps = {
  id: string;
  title: string;
  sourceBlogPostId?: string;
  sourcePage?: string;
};

const initial = { name: "", phone: "", email: "", company: "" };

export function LeadMagnetGate({ id, title, sourceBlogPostId, sourcePage }: LeadMagnetGateProps) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "submitting" | "ready" | "error">("idle");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const res = await fetch(`/api/lead-magnets/${id}/download`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        company: form.company,
        ...(sourceBlogPostId ? { sourceBlogPostId } : {}),
        ...(sourcePage ? { sourcePage } : {}),
      }),
    });
    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as { fileUrl?: string };
      setFileUrl(data.fileUrl ?? null);
      setStatus("ready");
      setForm(initial);
    } else {
      setStatus("error");
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-brand-900 placeholder:text-brand-400 focus:border-brand-500 focus:outline-none";

  if (status === "ready") {
    return (
      <div
        data-testid="lead-magnet-ready"
        className="rounded-xl border border-brand-100 bg-brand-50 p-6"
      >
        <h3 className="text-lg font-semibold text-brand-900">{title}</h3>
        <p className="mt-1 text-sm text-brand-700">Your guide is ready.</p>
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-800"
          >
            Download {title}
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="lead-magnet-gate"
      className="flex flex-col gap-3 rounded-xl border border-brand-100 bg-brand-50 p-6"
    >
      <h3 className="text-lg font-semibold text-brand-900">{title}</h3>
      <p className="text-sm text-brand-600">
        Enter your details and we'll send you the guide. No spam - just the download.
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
        type="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
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
        {status === "submitting" ? "Preparing..." : "Get the guide"}
      </button>
    </form>
  );
}
