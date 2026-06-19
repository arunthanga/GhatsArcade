"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { type GalleryImage, GalleryUploader } from "@/components/admin/GalleryUploader";
import { EVENT_STATUSES } from "@/types";

export type AdminEventRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  eventDate: string; // ISO
  theme: string | null;
  description: string;
  projectId: string | null;
  photos: { url: string; alt: string | null }[];
};

export type EventProjectOption = { id: string; title: string };

type EventForm = {
  title: string;
  description: string;
  eventDate: string; // YYYY-MM-DD
  theme: string;
  status: string;
  projectId: string;
  photos: GalleryImage[];
};

const emptyForm: EventForm = {
  title: "",
  description: "",
  eventDate: "",
  theme: "",
  status: "upcoming",
  projectId: "",
  photos: [],
};

function isoToDateInput(iso: string): string {
  return iso.slice(0, 10);
}

function rowToForm(row: AdminEventRow): EventForm {
  return {
    title: row.title,
    description: row.description,
    eventDate: isoToDateInput(row.eventDate),
    theme: row.theme ?? "",
    status: row.status,
    projectId: row.projectId ?? "",
    photos: row.photos.map((p) => ({ url: p.url, alt: p.alt ?? undefined })),
  };
}

function toPayload(form: EventForm) {
  return {
    title: form.title,
    description: form.description,
    eventDate: form.eventDate,
    theme: form.theme || undefined,
    status: form.status,
    projectId: form.projectId || undefined,
    photos: form.photos.map((p, index) => ({ url: p.url, alt: p.alt, sortOrder: index })),
  };
}

const inputClass =
  "w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500";

export function EventManager({
  initialEvents,
  projects,
}: {
  initialEvents: AdminEventRow[];
  projects: EventProjectOption[];
}) {
  const router = useRouter();
  const [createForm, setCreateForm] = useState<EventForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EventForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(toPayload(createForm)),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not create the event. Check the fields and try again.");
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
    const res = await fetch(`/api/events/${editingId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(toPayload(editForm)),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not save the event.");
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  async function handleStatusChange(id: string, status: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not update the event status.");
      return;
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this event? This cannot be undone.")) {
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok && res.status !== 204) {
      setError("Could not delete the event.");
      return;
    }
    if (editingId === id) {
      setEditingId(null);
    }
    router.refresh();
  }

  return (
    <section data-testid="event-manager" className="space-y-8">
      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-800/60 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {initialEvents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-400">
                  No events yet. Create your first one below.
                </td>
              </tr>
            ) : (
              initialEvents.map((evt) => (
                <tr key={evt.id} className="text-slate-200">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{evt.title}</div>
                    <div className="text-xs text-slate-500">/{evt.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {new Date(evt.eventDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={evt.status}
                      onChange={(e) => handleStatusChange(evt.id, e.target.value)}
                      disabled={busy}
                      className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-100"
                    >
                      {EVENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(evt.id);
                          setEditForm(rowToForm(evt));
                        }}
                        className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(evt.id)}
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
            <h3 className="text-sm font-semibold text-white">Edit event</h3>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
          <EventFields form={editForm} setForm={setEditForm} projects={projects} />
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
        <h3 className="text-sm font-semibold text-white">Add a new event</h3>
        <EventFields form={createForm} setForm={setCreateForm} projects={projects} />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          Add event
        </button>
      </form>
    </section>
  );
}

function EventFields({
  form,
  setForm,
  projects,
}: {
  form: EventForm;
  setForm: (next: EventForm) => void;
  projects: EventProjectOption[];
}) {
  return (
    <div className="grid gap-4">
      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Title
        <input
          className={inputClass}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Date
          <input
            type="date"
            className={inputClass}
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Status
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {EVENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Theme (optional)
          <input
            className={inputClass}
            value={form.theme}
            onChange={(e) => setForm({ ...form, theme: e.target.value })}
            placeholder="e.g. Harvest Day"
          />
        </label>
      </div>

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

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Description
        <textarea
          className={`${inputClass} min-h-32`}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </label>

      <div className="flex flex-col gap-2 text-sm text-slate-300">
        <span>Photos</span>
        <GalleryUploader
          images={form.photos}
          onChange={(photos) => setForm({ ...form, photos })}
          category="events"
        />
      </div>
    </div>
  );
}
