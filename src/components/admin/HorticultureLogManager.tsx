"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HORTICULTURE_ACTIVITY_LABELS, HORTICULTURE_ACTIVITY_TYPES } from "@/types";

export type AdminLogRow = {
  id: string;
  projectId: string;
  projectTitle: string;
  plotId: string | null;
  plotNumber: string | null;
  activityType: string;
  description: string;
  activityDate: string; // ISO
};

export type LoggingProject = {
  id: string;
  title: string;
  plots: { id: string; plotNumber: string }[];
};

type LogForm = {
  projectId: string;
  plotId: string;
  activityType: string;
  description: string;
  activityDate: string; // YYYY-MM-DD
};

const emptyForm: LogForm = {
  projectId: "",
  plotId: "",
  activityType: "maintenance",
  description: "",
  activityDate: "",
};

function rowToForm(row: AdminLogRow): LogForm {
  return {
    projectId: row.projectId,
    plotId: row.plotId ?? "",
    activityType: row.activityType,
    description: row.description,
    activityDate: row.activityDate.slice(0, 10),
  };
}

function toPayload(form: LogForm) {
  return {
    projectId: form.projectId,
    plotId: form.plotId || undefined,
    activityType: form.activityType,
    description: form.description,
    activityDate: form.activityDate,
  };
}

function activityLabel(type: string): string {
  return (
    HORTICULTURE_ACTIVITY_LABELS[type as keyof typeof HORTICULTURE_ACTIVITY_LABELS] ?? type
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500";

export function HorticultureLogManager({
  initialLogs,
  projects,
}: {
  initialLogs: AdminLogRow[];
  projects: LoggingProject[];
}) {
  const router = useRouter();
  const [createForm, setCreateForm] = useState<LogForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<LogForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/horticulture-logs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(toPayload(createForm)),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not create the log. Check the fields and try again.");
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
    const res = await fetch(`/api/horticulture-logs/${editingId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(toPayload(editForm)),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not save the log.");
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this log entry? This cannot be undone.")) {
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/horticulture-logs/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok && res.status !== 204) {
      setError("Could not delete the log.");
      return;
    }
    if (editingId === id) {
      setEditingId(null);
    }
    router.refresh();
  }

  return (
    <section data-testid="horticulture-log-manager" className="space-y-8">
      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/60 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Project / Plot</th>
              <th className="px-4 py-3">Activity</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {initialLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-slate-400">
                  No logs yet. Record your first activity below.
                </td>
              </tr>
            ) : (
              initialLogs.map((log) => (
                <tr key={log.id} className="align-top text-slate-200">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                    {new Date(log.activityDate).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{log.projectTitle}</div>
                    <div className="text-xs text-slate-500">
                      {log.plotNumber ? `Plot ${log.plotNumber}` : "Whole project"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-900/50 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                      {activityLabel(log.activityType)}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-300">
                    <span className="line-clamp-2">{log.description}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(log.id);
                          setEditForm(rowToForm(log));
                        }}
                        className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(log.id)}
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
            <h3 className="text-sm font-semibold text-white">Edit log entry</h3>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
          <LogFields form={editForm} setForm={setEditForm} projects={projects} />
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
        <h3 className="text-sm font-semibold text-white">Record an activity</h3>
        <LogFields form={createForm} setForm={setCreateForm} projects={projects} />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          Add log
        </button>
      </form>
    </section>
  );
}

function LogFields({
  form,
  setForm,
  projects,
}: {
  form: LogForm;
  setForm: (next: LogForm) => void;
  projects: LoggingProject[];
}) {
  const selectedProject = projects.find((p) => p.id === form.projectId);
  const plots = selectedProject?.plots ?? [];

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Project
          <select
            className={inputClass}
            value={form.projectId}
            onChange={(e) =>
              // Changing the project clears any plot from another project.
              setForm({ ...form, projectId: e.target.value, plotId: "" })
            }
            required
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Plot (optional)
          <select
            className={inputClass}
            value={form.plotId}
            onChange={(e) => setForm({ ...form, plotId: e.target.value })}
            disabled={plots.length === 0}
          >
            <option value="">Whole project</option>
            {plots.map((plot) => (
              <option key={plot.id} value={plot.id}>
                Plot {plot.plotNumber}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Activity type
          <select
            className={inputClass}
            value={form.activityType}
            onChange={(e) => setForm({ ...form, activityType: e.target.value })}
          >
            {HORTICULTURE_ACTIVITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {HORTICULTURE_ACTIVITY_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Activity date
          <input
            type="date"
            className={inputClass}
            value={form.activityDate}
            onChange={(e) => setForm({ ...form, activityDate: e.target.value })}
            required
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Notes
        <textarea
          className={`${inputClass} min-h-28`}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          placeholder="What was done, by whom, and anything worth remembering."
        />
      </label>
    </div>
  );
}
