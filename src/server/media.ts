// Media library: read back and manage what's already been uploaded (prj.md Section 5).
// This is filesystem-backed and mirrors the category folders written by src/lib/uploads.ts.
// Server-only — never import into a Client Component.

import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { serverEnv } from "@/lib/env";
import {
  isUploadCategory,
  kindFromFilename,
  UPLOAD_CATEGORIES,
  type UploadCategory,
  type UploadKind,
} from "@/lib/uploads";

export type MediaItem = {
  category: UploadCategory;
  filename: string;
  url: string;
  kind: UploadKind | "file";
  sizeBytes: number;
  modifiedAt: string; // ISO
};

function categoryDir(category: UploadCategory): string {
  return path.resolve(process.cwd(), serverEnv.UPLOAD_DIR, category);
}

function publicUrl(category: UploadCategory, filename: string): string {
  return `${serverEnv.UPLOAD_PUBLIC_BASE.replace(/\/+$/, "")}/${category}/${filename}`;
}

async function listCategory(category: UploadCategory): Promise<MediaItem[]> {
  let entries: Awaited<ReturnType<typeof readdir>>;
  try {
    entries = await readdir(categoryDir(category), { withFileTypes: true });
  } catch {
    return []; // folder not created yet
  }

  const items: MediaItem[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || entry.name.startsWith(".")) {
      continue; // skip .gitkeep and any stray dirs
    }
    const stats = await stat(path.join(categoryDir(category), entry.name));
    items.push({
      category,
      filename: entry.name,
      url: publicUrl(category, entry.name),
      kind: kindFromFilename(entry.name),
      sizeBytes: stats.size,
      modifiedAt: stats.mtime.toISOString(),
    });
  }
  return items;
}

// Every stored asset, newest first within each category.
export async function listMedia(): Promise<MediaItem[]> {
  const groups = await Promise.all(UPLOAD_CATEGORIES.map((category) => listCategory(category)));
  return groups
    .flat()
    .sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : a.modifiedAt > b.modifiedAt ? -1 : 0));
}

// A safe stored filename is a single path segment (no separators / traversal).
function isSafeFilename(filename: string): boolean {
  return filename.length > 0 && !filename.startsWith(".") && path.basename(filename) === filename;
}

export class MediaError extends Error {}

// Delete one asset. Validates the category against the allowlist and refuses anything that
// is not a plain filename, so a crafted value can never escape the uploads directory.
export async function deleteMedia(category: unknown, filename: unknown): Promise<void> {
  if (!isUploadCategory(category)) {
    throw new MediaError("Unknown media category.");
  }
  if (typeof filename !== "string" || !isSafeFilename(filename)) {
    throw new MediaError("Invalid filename.");
  }

  const target = path.join(categoryDir(category), filename);
  // Defence in depth: confirm the resolved path is still inside the category folder.
  const root = categoryDir(category);
  if (target !== path.join(root, filename) || !target.startsWith(root + path.sep)) {
    throw new MediaError("Invalid path.");
  }

  try {
    await unlink(target);
  } catch {
    throw new MediaError("File not found.");
  }
}
