"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MediaUploader, type UploadCategory } from "@/components/admin/MediaUploader";

export type MediaLibraryItem = {
  category: string;
  filename: string;
  url: string;
  kind: "image" | "pdf" | "video" | "file";
  sizeBytes: number;
  modifiedAt: string;
};

const CATEGORY_OPTIONS: UploadCategory[] = [
  "projects",
  "listings",
  "blog",
  "events",
  "testimonials",
  "lead-magnets",
  "misc",
];

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ items }: { items: MediaLibraryItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [uploadCategory, setUploadCategory] = useState<UploadCategory>("projects");
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.category === filter)),
    [items, filter],
  );

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(new URL(url, window.location.origin).toString());
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  async function handleDelete(item: MediaLibraryItem) {
    if (!window.confirm(`Delete ${item.filename}? This cannot be undone.`)) {
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(
      `/api/media?category=${encodeURIComponent(item.category)}&filename=${encodeURIComponent(item.filename)}`,
      { method: "DELETE" },
    );
    setBusy(false);
    if (!res.ok && res.status !== 204) {
      setError("Could not delete the file.");
      return;
    }
    router.refresh();
  }

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      map.set(item.category, (map.get(item.category) ?? 0) + 1);
    }
    return map;
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Upload */}
      <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
        <h2 className="mb-3 text-sm font-semibold text-white">Upload to the library</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1 text-sm text-slate-300">
            Category
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as UploadCategory)}
              className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <div className="flex-1">
            <MediaUploader
              label="Choose a photo, PDF, or video"
              accept="image/*,application/pdf,video/mp4,video/webm"
              category={uploadCategory}
              previewAsImage={false}
              onUploaded={() => router.refresh()}
            />
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          label={`All (${items.length})`}
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {CATEGORY_OPTIONS.map((c) => (
          <FilterChip
            key={c}
            label={`${c} (${counts.get(c) ?? 0})`}
            active={filter === c}
            onClick={() => setFilter(c)}
          />
        ))}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      {visible.length === 0 ? (
        <p className="text-sm text-slate-400">No assets in this category yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((item) => (
            <li
              key={`${item.category}/${item.filename}`}
              className="flex flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50"
            >
              <div className="flex h-32 items-center justify-center bg-slate-900">
                {item.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.filename} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {item.kind}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <p className="truncate text-xs text-slate-400" title={item.filename}>
                  {item.category} · {formatSize(item.sizeBytes)}
                </p>
                <div className="mt-auto flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url)}
                    className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                  >
                    {copied === item.url ? "Copied!" : "Copy URL"}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={busy}
                    className="rounded border border-red-900 px-2 py-1 text-xs text-red-400 hover:bg-red-950 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );
}
