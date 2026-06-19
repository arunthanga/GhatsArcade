import { NextResponse } from "next/server";
import { AuthorizationError } from "@/lib/errors";
import { exportCsv, isExportDataset } from "@/server/export";
import { getCurrentUser } from "@/server/session";

// OWNER-ONLY data export (prj.md Section 9). Streams a CSV download; Admins get 403.
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dataset = new URL(request.url).searchParams.get("dataset");
  if (!isExportDataset(dataset)) {
    return NextResponse.json(
      { error: "Invalid dataset. Use ?dataset=leads, listings, projects, or events." },
      { status: 400 },
    );
  }

  try {
    const { filename, csv } = await exportCsv({ actorRole: user.role, dataset });
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}
