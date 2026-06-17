"use client";

import { useCallback, useEffect, useState } from "react";

type AdminRow = { id: string; email: string; name: string; role: string };

export function AdminManager() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admins");
    if (res.ok) {
      const data = (await res.json()) as { admins: AdminRow[] };
      setAdmins(data.admins);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not create admin. Check the details and try again.");
      return;
    }
    setForm({ name: "", email: "", password: "" });
    await load();
  }

  async function handleDelete(id: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok && res.status !== 204) {
      setError("Could not delete admin.");
      return;
    }
    await load();
  }

  return (
    <section data-testid="admin-manager">
      <h2>Admins</h2>
      <ul>
        {admins.map((admin) => (
          <li key={admin.id}>
            {admin.name} ({admin.email})
            <button type="button" onClick={() => handleDelete(admin.id)} disabled={busy}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h3>Add admin</h3>
      <form onSubmit={handleCreate}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Temporary password (min 8 chars)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength={8}
          required
        />
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit" disabled={busy}>
          Add admin
        </button>
      </form>
    </section>
  );
}
