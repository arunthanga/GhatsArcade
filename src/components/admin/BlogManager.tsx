"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS, BLOG_STATUSES } from "@/types";

export type AdminBlogRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  body: string;
  coverImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  estimatedReadMinutes: number | null;
};

type PostForm = {
  title: string;
  body: string;
  category: string;
  status: string;
  coverImage: string;
  ogImageUrl: string;
  metaTitle: string;
  metaDescription: string;
  readMinutes: string;
};

const emptyForm: PostForm = {
  title: "",
  body: "",
  category: "lifestyle",
  status: "draft",
  coverImage: "",
  ogImageUrl: "",
  metaTitle: "",
  metaDescription: "",
  readMinutes: "",
};

function rowToForm(row: AdminBlogRow): PostForm {
  return {
    title: row.title,
    body: row.body,
    category: row.category,
    status: row.status,
    coverImage: row.coverImage ?? "",
    ogImageUrl: row.ogImageUrl ?? "",
    metaTitle: row.metaTitle ?? "",
    metaDescription: row.metaDescription ?? "",
    readMinutes: row.estimatedReadMinutes != null ? String(row.estimatedReadMinutes) : "",
  };
}

// Builds the JSON body. An empty reading-time field is omitted so the server re-estimates it.
function toPayload(form: PostForm) {
  const payload: Record<string, unknown> = {
    title: form.title,
    body: form.body,
    category: form.category,
    status: form.status,
    coverImage: form.coverImage,
    ogImageUrl: form.ogImageUrl,
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,
  };
  if (form.readMinutes.trim() !== "") {
    payload.estimatedReadMinutes = Number(form.readMinutes);
  }
  return payload;
}

const inputClass =
  "w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500";

export function BlogManager({ initialPosts }: { initialPosts: AdminBlogRow[] }) {
  const router = useRouter();
  const [createForm, setCreateForm] = useState<PostForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<PostForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(toPayload(createForm)),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not create the post. Check the fields and try again.");
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
    const res = await fetch(`/api/blog/${editingId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(toPayload(editForm)),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not save the post.");
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  async function handleStatusChange(id: string, status: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/blog/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not update the post status.");
      return;
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this post? This cannot be undone.")) {
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok && res.status !== 204) {
      setError("Could not delete the post.");
      return;
    }
    if (editingId === id) {
      setEditingId(null);
    }
    router.refresh();
  }

  return (
    <section data-testid="blog-manager" className="space-y-8">
      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      {/* Existing posts */}
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-800/60 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Read</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {initialPosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-slate-400">
                  No posts yet. Create your first one below.
                </td>
              </tr>
            ) : (
              initialPosts.map((post) => (
                <tr key={post.id} className="text-slate-200">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{post.title}</div>
                    <div className="text-xs text-slate-500">/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {BLOG_CATEGORY_LABELS[post.category as keyof typeof BLOG_CATEGORY_LABELS] ??
                      post.category}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {post.estimatedReadMinutes ? `${post.estimatedReadMinutes} min` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={post.status}
                      onChange={(e) => handleStatusChange(post.id, e.target.value)}
                      disabled={busy}
                      className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-100"
                    >
                      {BLOG_STATUSES.map((status) => (
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
                          setEditingId(post.id);
                          setEditForm(rowToForm(post));
                        }}
                        className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
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

      {/* Edit panel */}
      {editingId ? (
        <form
          onSubmit={handleSaveEdit}
          className="space-y-4 rounded-xl border border-emerald-800 bg-slate-800/40 p-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Edit post</h3>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
          <PostFields form={editForm} setForm={setEditForm} />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            Save changes
          </button>
        </form>
      ) : null}

      {/* Create */}
      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-xl border border-slate-700 bg-slate-800/40 p-5"
      >
        <h3 className="text-sm font-semibold text-white">Add a new post</h3>
        <PostFields form={createForm} setForm={setCreateForm} />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          Add post
        </button>
      </form>
    </section>
  );
}

// Shared field set for both create and edit forms.
function PostFields({
  form,
  setForm,
}: {
  form: PostForm;
  setForm: (next: PostForm) => void;
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
          Category
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {BLOG_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {BLOG_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Status
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {BLOG_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Read time (min)
          <input
            type="number"
            min={1}
            max={120}
            placeholder="auto"
            className={inputClass}
            value={form.readMinutes}
            onChange={(e) => setForm({ ...form, readMinutes: e.target.value })}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-slate-300">
        Body
        <textarea
          className={`${inputClass} min-h-40`}
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <MediaUploader
          label="Cover image"
          accept="image/*"
          category="blog"
          currentUrl={form.coverImage || null}
          onUploaded={(result) => setForm({ ...form, coverImage: result.url })}
        />
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          …or paste a cover image URL
          <input
            className={inputClass}
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            placeholder="https://…"
          />
        </label>
      </div>

      <fieldset className="grid gap-4 rounded-lg border border-slate-700 p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          SEO (optional — falls back to the title, an excerpt, and the cover image)
        </legend>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Meta title
          <input
            className={inputClass}
            maxLength={70}
            value={form.metaTitle}
            onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            placeholder="Up to ~60 characters"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Meta description
          <textarea
            className={inputClass}
            maxLength={200}
            value={form.metaDescription}
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
            placeholder="Up to ~155 characters"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          Social/OG image URL
          <input
            className={inputClass}
            value={form.ogImageUrl}
            onChange={(e) => setForm({ ...form, ogImageUrl: e.target.value })}
            placeholder="https://… (defaults to the cover image)"
          />
        </label>
      </fieldset>
    </div>
  );
}
