"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";

export type AdminLeadMagnetRow = {
  id: string;
  title: string;
  fileUrl: string;
  isActive: boolean;
  downloadCount: number;
};

const emptyForm = { title: "", fileUrl: "" };

export function LeadMagnetManager({ initialMagnets }: { initialMagnets: AdminLeadMagnetRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/lead-magnets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: form.title, fileUrl: form.fileUrl }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not create the lead magnet. Check the fields and try again.");
      return;
    }
    setForm(emptyForm);
    router.refresh();
  }

  async function toggleActive(id: string, isActive: boolean) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/lead-magnets/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not update the lead magnet.");
      return;
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/lead-magnets/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok && res.status !== 204) {
      setError("Could not delete the lead magnet.");
      return;
    }
    router.refresh();
  }

  return (
    <section data-testid="lead-magnet-manager">
      {error ? <p role="alert">{error}</p> : null}

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>File</th>
              <th>Downloads</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {initialMagnets.map((magnet) => (
              <tr key={magnet.id}>
                <td>{magnet.title}</td>
                <td>
                  <a href={magnet.fileUrl} target="_blank" rel="noopener noreferrer">
                    view
                  </a>
                </td>
                <td>{magnet.downloadCount}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => toggleActive(magnet.id, !magnet.isActive)}
                    disabled={busy}
                  >
                    {magnet.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>
                  <button type="button" onClick={() => handleDelete(magnet.id)} disabled={busy}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Add lead magnet</h3>
      <form onSubmit={handleCreate}>
        <input
          placeholder="Title (e.g. NRI Buyer's Guide)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <MediaUploader
          label="Upload PDF"
          accept="application/pdf"
          category="lead-magnets"
          currentUrl={form.fileUrl || null}
          previewAsImage={false}
          onUploaded={(result) => setForm({ ...form, fileUrl: result.url })}
        />
        <input
          placeholder="…or paste a file URL"
          value={form.fileUrl}
          onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
          required
        />
        <button type="submit" disabled={busy}>
          Add lead magnet
        </button>
      </form>
    </section>
  );
}
