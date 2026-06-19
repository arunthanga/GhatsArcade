"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PLOT_STATUSES } from "@/types";

export type AdminPlotRow = {
  id: string;
  plotNumber: string;
  sizeCents: number;
  pricePerCent: number;
  totalPrice: number;
  status: string;
};

const emptyForm = {
  plotNumber: "",
  sizeCents: "",
  pricePerCent: "",
  status: "available" as string,
};

export function PlotManager({
  projectId,
  initialPlots,
}: {
  projectId: string;
  initialPlots: AdminPlotRow[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/projects/${projectId}/plots`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        plotNumber: form.plotNumber,
        sizeCents: Number(form.sizeCents),
        pricePerCent: Number(form.pricePerCent),
        status: form.status,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not add the plot. Check the fields and try again.");
      return;
    }
    setForm(emptyForm);
    router.refresh();
  }

  async function handleStatusChange(id: string, status: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/plots/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not update the plot status.");
      return;
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/plots/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok && res.status !== 204) {
      setError("Could not delete the plot.");
      return;
    }
    router.refresh();
  }

  return (
    <section data-testid="plot-manager">
      {error ? <p role="alert">{error}</p> : null}

      <div className="overflow-x-auto">
        <table>
        <thead>
          <tr>
            <th>Plot</th>
            <th>Size (cents)</th>
            <th>Price / cent</th>
            <th>Total</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {initialPlots.map((plot) => (
            <tr key={plot.id}>
              <td>{plot.plotNumber}</td>
              <td>{plot.sizeCents}</td>
              <td>{plot.pricePerCent}</td>
              <td>{plot.totalPrice}</td>
              <td>
                <select
                  value={plot.status}
                  onChange={(e) => handleStatusChange(plot.id, e.target.value)}
                  disabled={busy}
                >
                  {PLOT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button type="button" onClick={() => handleDelete(plot.id)} disabled={busy}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <h3>Add plot</h3>
      <form onSubmit={handleCreate}>
        <input
          placeholder="Plot number"
          value={form.plotNumber}
          onChange={(e) => setForm({ ...form, plotNumber: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Size (cents)"
          value={form.sizeCents}
          onChange={(e) => setForm({ ...form, sizeCents: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price per cent (INR)"
          value={form.pricePerCent}
          onChange={(e) => setForm({ ...form, pricePerCent: e.target.value })}
          required
        />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {PLOT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button type="submit" disabled={busy}>
          Add plot
        </button>
      </form>
    </section>
  );
}
