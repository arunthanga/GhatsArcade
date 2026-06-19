"use client";

import { useState } from "react";
import { type UploadCategory, uploadFile } from "@/components/admin/MediaUploader";

export type GalleryImage = {
  url: string;
  alt?: string;
  tag?: string;
};

// Multi-image uploader: pick one or many images, each is optimised on the server, then
// the admin can tag/alt/reorder/remove them. The parent owns the array (controlled).
type GalleryUploaderProps = {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  category: UploadCategory;
  tags?: readonly string[];
};

export function GalleryUploader({ images, onChange, category, tags }: GalleryUploaderProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const uploaded: GalleryImage[] = [];
      for (const file of files) {
        const result = await uploadFile(file, category);
        uploaded.push({ url: result.url });
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  function update(index: number, patch: Partial<GalleryImage>) {
    onChange(images.map((img, i) => (i === index ? { ...img, ...patch } : img)));
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= images.length) {
      return;
    }
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        disabled={busy}
        className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-500 disabled:opacity-60"
      />
      {busy ? <p className="text-xs text-slate-400">Uploading and optimising…</p> : null}
      {error ? (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      ) : null}

      {images.length > 0 ? (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {images.map((image, index) => (
            <li
              key={image.url}
              className="flex gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt ?? ""}
                className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
              />
              <div className="flex flex-1 flex-col gap-2">
                <input
                  placeholder="Alt text"
                  value={image.alt ?? ""}
                  onChange={(e) => update(index, { alt: e.target.value })}
                  className="rounded border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-100"
                />
                {tags && tags.length > 0 ? (
                  <select
                    value={image.tag ?? ""}
                    onChange={(e) => update(index, { tag: e.target.value || undefined })}
                    className="rounded border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-100"
                  >
                    <option value="">No tag</option>
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                ) : null}
                <div className="flex gap-2 text-xs">
                  <button type="button" onClick={() => move(index, -1)} className="text-slate-300">
                    ↑
                  </button>
                  <button type="button" onClick={() => move(index, 1)} className="text-slate-300">
                    ↓
                  </button>
                  <button type="button" onClick={() => remove(index)} className="text-red-400">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
