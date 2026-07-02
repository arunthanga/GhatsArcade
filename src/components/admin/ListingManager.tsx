"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LAND_TYPES, LISTING_STATUSES } from "@/types";

export type AdminListingRow = {
  id: string;
  title: string;
  slug: string;
  district: string;
  status: string;
  priceInr: number;
  sizeAcres: number;
};

const emptyForm = {
  title: "",
  description: "",
  district: "",
  nearestTown: "",
  landType: LAND_TYPES[0] as string,
  sizeAcres: "",
  priceInr: "",
  status: "draft" as string,
};

export function ListingManager({ initialListings }: { initialListings: AdminListingRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        district: form.district,
        nearestTown: form.nearestTown || undefined,
        landType: form.landType,
        sizeAcres: Number(form.sizeAcres),
        priceInr: Number(form.priceInr),
        status: form.status,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not create the listing. Check the fields and try again.");
      return;
    }
    setForm(emptyForm);
    router.refresh();
  }

  async function handleStatusChange(id: string, status: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/listings/${id}`, {
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
    const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok && res.status !== 204) {
      setError("Could not delete the listing.");
      return;
    }
    router.refresh();
  }

  return (
    <section data-testid="listing-manager">
      {error ? <p role="alert">{error}</p> : null}

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>District</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {initialListings.map((listing) => (
              <tr key={listing.id}>
                <td>{listing.title}</td>
                <td>{listing.district}</td>
                <td>
                  <select
                    value={listing.status}
                    onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                    disabled={busy}
                  >
                    {LISTING_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button type="button" onClick={() => handleDelete(listing.id)} disabled={busy}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Add listing</h3>
      <form onSubmit={handleCreate}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="District"
          value={form.district}
          onChange={(e) => setForm({ ...form, district: e.target.value })}
          required
        />
        <input
          placeholder="Nearest town (optional)"
          value={form.nearestTown}
          onChange={(e) => setForm({ ...form, nearestTown: e.target.value })}
        />
        <select
          value={form.landType}
          onChange={(e) => setForm({ ...form, landType: e.target.value })}
        >
          {LAND_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Size (acres)"
          value={form.sizeAcres}
          onChange={(e) => setForm({ ...form, sizeAcres: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price (INR)"
          value={form.priceInr}
          onChange={(e) => setForm({ ...form, priceInr: e.target.value })}
          required
        />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {LISTING_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button type="submit" disabled={busy}>
          Add listing
        </button>
      </form>
    </section>
  );
}
