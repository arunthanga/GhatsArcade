// Server-only media pipeline (prj.md Section 7). Stores uploads on local disk / a Docker
// volume (UPLOAD_DIR) and serves them under UPLOAD_PUBLIC_BASE. Images are normalised and
// re-encoded to WebP with `sharp` (strips EXIF, fixes orientation, caps dimensions); PDFs
// and short videos are stored as-is behind an allowlist + size cap.
//
// Never import this into a Client Component — it touches the filesystem and `sharp`.

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { serverEnv } from "@/lib/env";

export type UploadKind = "image" | "pdf" | "video";

// Assets are filed into a small, fixed set of human-readable folders so the media library
// on disk (and in the Docker volume) stays browsable for non-developer admins and ops —
// e.g. public/uploads/projects/<id>.webp instead of one flat dump. Add a new category here
// (and nowhere else) when a new content type starts accepting uploads.
export const UPLOAD_CATEGORIES = [
  "projects",
  "listings",
  "blog",
  "events",
  "testimonials",
  "lead-magnets",
  "misc",
] as const;
export type UploadCategory = (typeof UPLOAD_CATEGORIES)[number];

export function isUploadCategory(value: unknown): value is UploadCategory {
  return typeof value === "string" && (UPLOAD_CATEGORIES as readonly string[]).includes(value);
}

export type StoredUpload = {
  url: string;
  kind: UploadKind;
  category: UploadCategory;
  width?: number;
  height?: number;
};

export class UploadError extends Error {}

const IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const VIDEO_MIME = new Map<string, string>([
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
]);
const PDF_MIME = "application/pdf";

const MB = 1024 * 1024;

// Largest stored image edge. Bigger uploads are scaled down (never up).
const MAX_IMAGE_EDGE = 2000;

// Best-effort kind from a stored filename's extension (used by the media library, which
// reads the folder back rather than the original MIME type).
export function kindFromFilename(filename: string): UploadKind | "file" {
  const ext = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
  if (["webp", "jpg", "jpeg", "png", "gif", "avif"].includes(ext)) {
    return "image";
  }
  if (ext === "pdf") {
    return "pdf";
  }
  if (["mp4", "webm"].includes(ext)) {
    return "video";
  }
  return "file";
}

function classify(mime: string): UploadKind | null {
  if (IMAGE_MIME.has(mime)) {
    return "image";
  }
  if (mime === PDF_MIME) {
    return "pdf";
  }
  if (VIDEO_MIME.has(mime)) {
    return "video";
  }
  return null;
}

function sizeCapBytes(kind: UploadKind): number {
  switch (kind) {
    case "image":
      return serverEnv.MAX_IMAGE_UPLOAD_MB * MB;
    case "pdf":
      return serverEnv.MAX_PDF_UPLOAD_MB * MB;
    case "video":
      return serverEnv.MAX_VIDEO_UPLOAD_MB * MB;
  }
}

function publicUrl(category: UploadCategory, filename: string): string {
  // Join with single forward slashes regardless of how the base is configured.
  return `${serverEnv.UPLOAD_PUBLIC_BASE.replace(/\/+$/, "")}/${category}/${filename}`;
}

async function persist(category: UploadCategory, filename: string, data: Buffer): Promise<void> {
  const dir = path.resolve(process.cwd(), serverEnv.UPLOAD_DIR, category);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), data);
}

// Validate, process, and store a single uploaded file under its category folder.
// Returns the public URL + metadata.
export async function storeUpload(file: {
  mime: string;
  size: number;
  bytes: Buffer;
  category: UploadCategory;
}): Promise<StoredUpload> {
  const kind = classify(file.mime);
  if (!kind) {
    throw new UploadError(`Unsupported file type: ${file.mime || "unknown"}.`);
  }
  if (file.size > sizeCapBytes(kind)) {
    throw new UploadError("File is too large.");
  }

  const { category } = file;
  const id = randomUUID();

  if (kind === "image") {
    const pipeline = sharp(file.bytes, { failOn: "error" })
      .rotate() // honour EXIF orientation, then drop the metadata
      .resize({ width: MAX_IMAGE_EDGE, height: MAX_IMAGE_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 });
    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
    const filename = `${id}.webp`;
    await persist(category, filename, data);
    return { url: publicUrl(category, filename), kind, category, width: info.width, height: info.height };
  }

  if (kind === "pdf") {
    const filename = `${id}.pdf`;
    await persist(category, filename, file.bytes);
    return { url: publicUrl(category, filename), kind, category };
  }

  // video
  const ext = VIDEO_MIME.get(file.mime) ?? "mp4";
  const filename = `${id}.${ext}`;
  await persist(category, filename, file.bytes);
  return { url: publicUrl(category, filename), kind, category };
}
