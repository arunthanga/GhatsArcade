"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { countAvailablePlots } from "@/lib/plot-status";
import { LAND_REVENUE_CLASSIFICATIONS, PROJECT_STATUSES } from "@/types";

export type AdminProjectRow = {
  id: string;
  title: string;
  slug: string;
  locationDistrict: string;
  status: string;
  plots: { status: string }[];
};

const emptyForm = {
  title: "",
  tagline: "",
  theme: "",
  description: "",
  locationDistrict: "",
  locationNearestTown: "",
  landRevenueClassification: "purayidam" as string,
  status: "draft" as string,
};

export function ProjectManager({ initialProjects }: { initialProjects: AdminProjectRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        tagline: form.tagline || undefined,
        theme: form.theme || undefined,
        description: form.description,
        locationDistrict: form.locationDistrict,
        locationNearestTown: form.locationNearestTown || undefined,
        landRevenueClassification: form.landRevenueClassification,
        status: form.status,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not create the project. Check the fields and try again.");
      return;
    }
    setForm(emptyForm);
    router.refresh();
  }

  async function handleStatusChange(id: string, status: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Status change was rejected (check the allowed transitions).");
      return;
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok && res.status !== 204) {
      setError("Could not delete the project.");
      return;
    }
    router.refresh();
  }

  return (
    <section data-testid="project-manager">
      {error ? <p role="alert">{error}</p> : null}

      <div className="overflow-x-auto">
        <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>District</th>
            <th>Plots remaining</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {initialProjects.map((project) => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>{project.locationDistrict}</td>
              <td>{countAvailablePlots(project.plots)}</td>
              <td>
                <select
                  value={project.status}
                  onChange={(e) => handleStatusChange(project.id, e.target.value)}
                  disabled={busy}
                >
                  {PROJECT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <Link href={`/admin/projects/${project.id}`}>Manage plots</Link>{" "}
                <button type="button" onClick={() => handleDelete(project.id)} disabled={busy}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <h3>Add project</h3>
      <form onSubmit={handleCreate}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Tagline (optional)"
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
        />
        <input
          placeholder="Theme (optional)"
          value={form.theme}
          onChange={(e) => setForm({ ...form, theme: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="District"
          value={form.locationDistrict}
          onChange={(e) => setForm({ ...form, locationDistrict: e.target.value })}
          required
        />
        <input
          placeholder="Nearest town (optional)"
          value={form.locationNearestTown}
          onChange={(e) => setForm({ ...form, locationNearestTown: e.target.value })}
        />
        <select
          value={form.landRevenueClassification}
          onChange={(e) => setForm({ ...form, landRevenueClassification: e.target.value })}
        >
          {LAND_REVENUE_CLASSIFICATIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button type="submit" disabled={busy}>
          Add project
        </button>
      </form>
    </section>
  );
}
