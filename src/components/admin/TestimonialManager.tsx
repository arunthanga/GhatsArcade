"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TESTIMONIAL_BUYER_TYPE_LABELS, TESTIMONIAL_BUYER_TYPES } from "@/types";

export type AdminTestimonialRow = {
  id: string;
  buyerName: string;
  buyerCity: string | null;
  buyerType: string;
  quoteText: string;
  videoUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  projectId: string | null;
};

export type TestimonialProjectOption = { id: string; title: string };

type TestimonialForm = {
  buyerName: string;
  buyerCity: string;
  buyerType: string;
  quoteText: string;
  videoUrl: string;
  displayOrder: string;
  isActive: boolean;
  projectId: string;
};

const emptyForm: TestimonialForm = {
  buyerName: "",
  buyerCity: "",
  buyerType: "resident_indian",
  quoteText: "",
  videoUrl: "",
  displayOrder: "0",
  isActive: true,
  projectId: "",
};

function rowToForm(row: AdminTestimonialRow): TestimonialForm {
  return {
    buyerName: row.buyerName,
    buyerCity: row.buyerCity ?? "",
    buyerType: row.buyerType,
    quoteText: row.quoteText,
    videoUrl: row.videoUrl ?? "",
    displayOrder: String(row.displayOrder),
    isActive: row.isActive,
    projectId: row.projectId ?? "",
  };
}

function toPayload(form: TestimonialForm) {
  return {
    buyerName: form.buyerName,
    buyerCity: form.buyerCity || undefined,
    buyerType: form.buyerType,
    quoteText: form.quoteText,
    videoUrl: form.videoUrl || "",
    displayOrder: form.displayOrder === "" ? 0 : Number(form.displayOrder),
    isActive: form.isActive,
    projectId: form.projectId || undefined,
  };
}

const inputClass =
  "w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500";

export function TestimonialManager({
  initialTestimonials,
  projects,
}: {
  initialTestimonials: AdminTestimonialRow[];
  projects: TestimonialProjectOption[];
}) {
  const router = useRouter();
  const [createForm, setCreateForm] = useState<TestimonialForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TestimonialForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(toPayload(createForm)),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not create the testimonial. Check the fields and try again.");
      return;
    }
    setCreateForm(emptyForm);
    router.refresh();
  }

  async function handleSaveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) {
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/testimonials/${editingId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(toPayload(editForm)),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not save the testimonial.");
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/testimonials/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not update the testimonial.");
      return;
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this testimonial? This cannot be undone.")) {
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok && res.status !== 204) {
      setError("Could not delete the testimonial.");
      return;
    }
    if (editingId === id) {
      setEditingId(null);
    }
    router.refresh();
  }

  return (
    <section data-testid="testimonial-manager" className="space-y-8">
      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-800/60 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {initialTestimonials.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-slate-400">
                  No testimonials yet. Add your first owner story below.
                </td>
              </tr>
            ) : (
              initialTestimonials.map((row) => (
                <tr key={row.id} className="text-slate-200">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{row.buyerName}</div>
                    <div className="text-xs text-slate-500">
                      {row.buyerCity ?? "—"}
                      {row.videoUrl ? " · 🎬 video" : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {TESTIMONIAL_BUYER_TYPE_LABELS[
                      row.buyerType as keyof typeof TESTIMONIAL_BUYER_TYPE_LABELS
                    ] ?? row.buyerType}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{row.displayOrder}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(row.id, !row.isActive)}
                      disabled={busy}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.isActive
                          ? "bg-emerald-900/60 text-emerald-300"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {row.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(row.id);
                          setEditForm(rowToForm(row));
                        }}
                        className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        disabled={busy}
                        className="rounded border border-red-900 px-2 py-1 text-xs text-red-400 hover:bg-red-950 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingId ? (
        <form
          onSubmit={handleSaveEdit}
          className="space-y-4 rounded-xl border border-emerald-800 bg-slate-800/40 p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Edit testimonial</h3>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
          <TestimonialFields form={editForm} setForm={setEditForm} projects={projects} />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            Save changes
          </button>
        </form>
      ) : null}

      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-xl border border-slate-700 bg-slate-800/40 p-5"
      >
        <h3 className="text-sm font-semibold text-white">Add a new testimonial</h3>
        <TestimonialFields form={createForm} setForm={setCreateForm} projects={projects} />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          Add testimonial
        </button>
      </form>
    </section>
  );
}

function TestimonialFields({
  form,
  setForm,
  projects,
}: {
  form: TestimonialForm;
  setForm: (next: TestimonialForm) => void;
  projects: TestimonialProjectOption[];
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Buyer name
          <input
            className={inputClass}
            value={form.buyerName}
            onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          City (optional)
          <input
            className={inputClass}
            value={form.buyerCity}
            onChange={(e) => setForm({ ...form, buyerCity: e.target.value })}
            placeholder="e.g. Dubai"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Buyer type
          <select
            className={inputClass}
            value={form.buyerType}
            onChange={(e) => setForm({ ...form, buyerType: e.target.value })}
          >
            {TESTIMONIAL_BUYER_TYPES.map((t) => (
              <option key={t} value={t}>
                {TESTIMONIAL_BUYER_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Display order
          <input
            type="number"
            min={0}
            className={inputClass}
            value={form.displayOrder}
            onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Linked project (optional)
          <select
            className={inputClass}
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
          >
            <option value="">None</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Quote
        <textarea
          className={`${inputClass} min-h-28`}
          value={form.quoteText}
          onChange={(e) => setForm({ ...form, quoteText: e.target.value })}
          required
          placeholder="What the owner said about their experience."
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Video URL (optional — YouTube)
        <input
          className={inputClass}
          value={form.videoUrl}
          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=…"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
        />
        Show on the public site
      </label>
    </div>
  );
}
