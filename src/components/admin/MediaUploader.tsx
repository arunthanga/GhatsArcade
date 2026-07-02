"use client";

import { useState } from "react";

export type UploadResult = {
  url: string;
  kind: "image" | "pdf" | "video";
  category: string;
  width?: number;
  height?: number;
};

// Which uploads/<folder> the asset is filed under (must match UPLOAD_CATEGORIES on the server).
export type UploadCategory =
  | "projects"
  | "listings"
  | "blog"
  | "events"
  | "testimonials"
  | "lead-magnets"
  | "misc";

// Posts a single file to /api/uploads and hands the stored URL back to the caller.
// Reused across every admin form that needs media (cover photos, galleries, PDFs, video).
export async function uploadFile(
  file: File,
  category: UploadCategory = "misc",
): Promise<UploadResult> {
  const body = new FormData();
  body.append("file", file);
  body.append("category", category);
  const res = await fetch("/api/uploads", { method: "POST", body });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Upload failed.");
  }
  return (await res.json()) as UploadResult;
}

type MediaUploaderProps = {
  label: string;
  accept: string;
  category: UploadCategory;
  currentUrl?: string | null;
  previewAsImage?: boolean;
  onUploaded: (result: UploadResult) => void;
};

export function MediaUploader({
  label,
  accept,
  category,
  currentUrl,
  previewAsImage = true,
  onUploaded,
}: MediaUploaderProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await uploadFile(file, category);
      onUploaded(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {currentUrl ? (
        previewAsImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentUrl}
            alt="Current upload preview"
            className="h-28 w-full max-w-xs rounded-lg border border-slate-700 object-cover"
          />
        ) : (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-400 underline"
          >
            View current file
          </a>
        )
      ) : null}
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={busy}
        className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-500 disabled:opacity-60"
      />
      {busy ? <p className="text-xs text-slate-400">Uploading and optimising…</p> : null}
      {error ? (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
