import { NextResponse } from "next/server";
import { deleteMedia, listMedia, MediaError } from "@/server/media";
import { getCurrentUser } from "@/server/session";

export const runtime = "nodejs";

// Authenticated Owner/Admin only: list every stored asset.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ media: await listMedia() });
}

// Authenticated Owner/Admin only: delete an asset by ?category=&filename=.
export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  try {
    await deleteMedia(url.searchParams.get("category"), url.searchParams.get("filename"));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof MediaError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
