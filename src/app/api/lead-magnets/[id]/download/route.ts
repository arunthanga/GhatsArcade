import { NextResponse } from "next/server";
import { leadMagnetDownloadSchema } from "@/lib/validation";
import { recordDownload } from "@/server/lead-magnets";

type Ctx = { params: Promise<{ id: string }> };

// Public: exchange contact details for the gated file. The `company` honeypot, when
// filled, is treated as a bot — we return 200 without capturing or revealing the file.
export async function POST(request: Request, { params }: Ctx) {
  const parsed = leadMagnetDownloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { company, email, ...lead } = parsed.data;
  if (company && company.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const { id } = await params;
  const result = await recordDownload({
    id,
    lead: { ...lead, email: email ? email : undefined },
  });
  if (!result) {
    return NextResponse.json({ error: "This resource is no longer available." }, { status: 404 });
  }

  return NextResponse.json({ fileUrl: result.fileUrl, title: result.title }, { status: 201 });
}
