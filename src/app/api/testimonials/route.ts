import { NextResponse } from "next/server";
import { AuthorizationError } from "@/lib/errors";
import { createTestimonialSchema } from "@/lib/validation";
import { createTestimonial, listActiveTestimonials } from "@/server/testimonials";
import { getCurrentUser } from "@/server/session";

// Public: list active testimonials.
export async function GET() {
  return NextResponse.json({ testimonials: await listActiveTestimonials() });
}

// Owner/Admin: create a testimonial.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createTestimonialSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const testimonial = await createTestimonial({
      actorRole: user.role,
      createdById: user.id,
      data: parsed.data,
    });
    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}
