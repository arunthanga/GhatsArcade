import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { listMedia } from "@/server/media";
import { requireUser } from "@/server/session";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  // Any signed-in Owner/Admin may manage media (same bar as uploading it).
  await requireUser();
  const media = await listMedia();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Media Library</h1>
        <p className="text-sm text-slate-400">
          Every uploaded photo, PDF, and video. Upload new assets, copy a URL to reuse one, or
          delete what's no longer needed.
        </p>
      </div>
      <MediaLibrary
        items={media.map((item) => ({
          category: item.category,
          filename: item.filename,
          url: item.url,
          kind: item.kind,
          sizeBytes: item.sizeBytes,
          modifiedAt: item.modifiedAt,
        }))}
      />
    </div>
  );
}
