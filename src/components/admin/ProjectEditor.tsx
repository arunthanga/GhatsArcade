"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { type GalleryImage, GalleryUploader } from "@/components/admin/GalleryUploader";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { LAND_REVENUE_CLASSIFICATIONS, PROJECT_PHOTO_TAGS, ROAD_STATUSES } from "@/types";

export type ProjectEditorInitial = {
  title: string;
  tagline: string;
  theme: string;
  description: string;
  locationDistrict: string;
  locationNearestTown: string;
  latitude: string;
  longitude: string;
  keralaTnBorder: boolean;
  totalAreaAcres: string;
  landRevenueClassification: string;
  roadStatus: string;
  roadSpec: string;
  clubhouseDescription: string;
  waterSourceDescription: string;
  plantationDescription: string;
  maintenanceFeePerCentPerMonth: string;
  legalChecklistSummary: string;
  coverPhotoUrl: string;
  videoEmbedUrl: string;
  photos: GalleryImage[];
};

const input =
  "w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-slate-300";

function numberOrUndefined(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function ProjectEditor({
  projectId,
  initial,
}: {
  projectId: string;
  initial: ProjectEditorInitial;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function set<K extends keyof ProjectEditorInitial>(key: K, value: ProjectEditorInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);

    const payload = {
      title: form.title,
      tagline: form.tagline || undefined,
      theme: form.theme || undefined,
      description: form.description,
      locationDistrict: form.locationDistrict,
      locationNearestTown: form.locationNearestTown || undefined,
      latitude: numberOrUndefined(form.latitude),
      longitude: numberOrUndefined(form.longitude),
      keralaTnBorder: form.keralaTnBorder,
      totalAreaAcres: numberOrUndefined(form.totalAreaAcres),
      landRevenueClassification: form.landRevenueClassification,
      roadStatus: form.roadStatus,
      roadSpec: form.roadSpec || undefined,
      clubhouseDescription: form.clubhouseDescription || undefined,
      waterSourceDescription: form.waterSourceDescription || undefined,
      plantationDescription: form.plantationDescription || undefined,
      maintenanceFeePerCentPerMonth: numberOrUndefined(form.maintenanceFeePerCentPerMonth),
      legalChecklistSummary: form.legalChecklistSummary || undefined,
      coverPhotoUrl: form.coverPhotoUrl || undefined,
      videoEmbedUrl: form.videoEmbedUrl || undefined,
      photos: form.photos.map((photo, index) => ({
        url: photo.url,
        alt: photo.alt || undefined,
        tag: photo.tag || undefined,
        sortOrder: index,
      })),
    };

    const res = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus("saved");
      setMessage("Saved.");
      router.refresh();
    } else {
      setStatus("error");
      setMessage("Could not save. Check the fields and try again.");
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className={labelClass}>
          Title
          <input className={input} value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </label>
        <label className={labelClass}>
          Theme
          <input className={input} value={form.theme} onChange={(e) => set("theme", e.target.value)} />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Tagline
          <input className={input} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </label>
        <div className="md:col-span-2">
          <RichTextEditor
            label="Description"
            value={form.description}
            onChange={(value) => set("description", value)}
            required
          />
        </div>
        <label className={labelClass}>
          District
          <input
            className={input}
            value={form.locationDistrict}
            onChange={(e) => set("locationDistrict", e.target.value)}
            required
          />
        </label>
        <label className={labelClass}>
          Nearest town
          <input
            className={input}
            value={form.locationNearestTown}
            onChange={(e) => set("locationNearestTown", e.target.value)}
          />
        </label>
        <label className={labelClass}>
          Latitude
          <input
            className={input}
            type="number"
            step="any"
            inputMode="decimal"
            placeholder="e.g. 10.7867"
            value={form.latitude}
            onChange={(e) => set("latitude", e.target.value)}
          />
          <span className="text-xs font-normal text-slate-500">
            Decimal degrees. Set both lat &amp; lng to show a map on the public page.
          </span>
        </label>
        <label className={labelClass}>
          Longitude
          <input
            className={input}
            type="number"
            step="any"
            inputMode="decimal"
            placeholder="e.g. 76.6548"
            value={form.longitude}
            onChange={(e) => set("longitude", e.target.value)}
          />
        </label>
        <label className={labelClass}>
          Total area (acres)
          <input
            className={input}
            type="number"
            step="0.01"
            value={form.totalAreaAcres}
            onChange={(e) => set("totalAreaAcres", e.target.value)}
          />
        </label>
        <label className={labelClass}>
          Maintenance fee (₹/cent/month)
          <input
            className={input}
            type="number"
            value={form.maintenanceFeePerCentPerMonth}
            onChange={(e) => set("maintenanceFeePerCentPerMonth", e.target.value)}
          />
        </label>
        <label className={labelClass}>
          Land classification
          <select
            className={input}
            value={form.landRevenueClassification}
            onChange={(e) => set("landRevenueClassification", e.target.value)}
          >
            {LAND_REVENUE_CLASSIFICATIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Road status
          <select className={input} value={form.roadStatus} onChange={(e) => set("roadStatus", e.target.value)}>
            {ROAD_STATUSES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Road spec
          <input className={input} value={form.roadSpec} onChange={(e) => set("roadSpec", e.target.value)} />
        </label>
        <label className={labelClass}>
          Clubhouse
          <textarea
            className={input}
            rows={3}
            value={form.clubhouseDescription}
            onChange={(e) => set("clubhouseDescription", e.target.value)}
          />
        </label>
        <label className={labelClass}>
          Water source
          <textarea
            className={input}
            rows={3}
            value={form.waterSourceDescription}
            onChange={(e) => set("waterSourceDescription", e.target.value)}
          />
        </label>
        <label className={labelClass}>
          Plantation
          <textarea
            className={input}
            rows={3}
            value={form.plantationDescription}
            onChange={(e) => set("plantationDescription", e.target.value)}
          />
        </label>
        <label className={labelClass}>
          Legal checklist summary
          <textarea
            className={input}
            rows={3}
            value={form.legalChecklistSummary}
            onChange={(e) => set("legalChecklistSummary", e.target.value)}
          />
        </label>
        <label className={`${labelClass} flex-row items-center gap-2 md:col-span-2`}>
          <input
            type="checkbox"
            checked={form.keralaTnBorder}
            onChange={(e) => set("keralaTnBorder", e.target.checked)}
          />
          On the Kerala-Tamil Nadu border
        </label>
      </div>

      {/* Media */}
      <div className="grid grid-cols-1 gap-6 border-t border-slate-700 pt-6 md:grid-cols-2">
        <MediaUploader
          label="Cover photo"
          accept="image/*"
          category="projects"
          currentUrl={form.coverPhotoUrl || null}
          onUploaded={(result) => set("coverPhotoUrl", result.url)}
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">
            Video embed URL (YouTube/Vimeo) or upload below
          </span>
          <input
            className={input}
            value={form.videoEmbedUrl}
            onChange={(e) => set("videoEmbedUrl", e.target.value)}
          />
          <MediaUploader
            label="Upload a video file"
            accept="video/mp4,video/webm"
            category="projects"
            previewAsImage={false}
            currentUrl={form.videoEmbedUrl || null}
            onUploaded={(result) => set("videoEmbedUrl", result.url)}
          />
        </div>
      </div>

      <div className="border-t border-slate-700 pt-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-200">Gallery photos</h3>
        <GalleryUploader
          images={form.photos}
          onChange={(photos) => set("photos", photos)}
          category="projects"
          tags={PROJECT_PHOTO_TAGS}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save project"}
        </button>
        {message ? (
          <span
            className={status === "error" ? "text-sm text-red-400" : "text-sm text-emerald-400"}
            role={status === "error" ? "alert" : undefined}
          >
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
