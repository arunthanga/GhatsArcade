import { NextResponse } from "next/server";
import { sendInquiryConfirmationEmail } from "@/lib/email";
import { AuthorizationError } from "@/lib/errors";
import { can } from "@/lib/roles";
import { isLeadStatus } from "@/lib/lead-status";
import { leadCaptureSchema } from "@/lib/validation";
import { captureLead, listLeads } from "@/server/leads";
import { getCurrentUser } from "@/server/session";

// Public: capture an inquiry. The `company` honeypot, when filled, is treated as a
// bot - we return 200 without persisting so the bot sees a success.
export async function POST(request: Request) {
  const parsed = leadCaptureSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { company, ...inquiry } = parsed.data;
  if (company && company.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const lead = await captureLead(inquiry);

  // Best-effort confirmation email. Awaited so serverless functions don't drop the
  // request before it sends; failures are swallowed inside the mailer.
  if (lead.email) {
    await sendInquiryConfirmationEmail({ to: lead.email, name: lead.name });
  }

  return NextResponse.json({ lead: { id: lead.id } }, { status: 201 });
}

// Owner/Admin: list leads, optionally filtered by ?status=.
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!can(user.role, "lead:view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const statusParam = new URL(request.url).searchParams.get("status");
  const status = isLeadStatus(statusParam) ? statusParam : undefined;

  try {
    return NextResponse.json({ leads: await listLeads({ actorRole: user.role, status }) });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}
