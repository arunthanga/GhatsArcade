import { NextResponse } from "next/server";
import { AuthorizationError } from "@/lib/errors";
import { createListingSchema, listingFilterSchema } from "@/lib/validation";
import { createListing, listPublicListings } from "@/server/listings";
import { getCurrentUser } from "@/server/session";

// Public: list publicly-visible listings, optionally filtered via query string.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = listingFilterSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid filters", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  return NextResponse.json({ listings: await listPublicListings(parsed.data) });
}

// Owner/Admin: create a listing.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createListingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const listing = await createListing({
      actorRole: user.role,
      createdById: user.id,
      data: parsed.data,
    });
    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}
