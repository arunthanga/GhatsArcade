import { NextResponse } from "next/server";
import { isUploadCategory, storeUpload, UploadError } from "@/lib/uploads";
import { getCurrentUser } from "@/server/session";

// Filesystem + sharp need the Node runtime (not Edge).
export const runtime = "nodejs";

// Authenticated Owner/Admin only: accept one file via multipart/form-data under the
// `file` field, process + store it, and return its public URL. The login wall lives
// entirely here in /admin + the API — the public site never uploads or authenticates.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // Category decides which uploads/<folder> the asset lands in; unknown values fall back
  // to "misc" so a bad client value never escapes the allowlist.
  const rawCategory = form.get("category");
  const category = isUploadCategory(rawCategory) ? rawCategory : "misc";

  try {
    const stored = await storeUpload({
      mime: file.type,
      size: file.size,
      bytes: Buffer.from(await file.arrayBuffer()),
      category,
    });
    return NextResponse.json(stored, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
