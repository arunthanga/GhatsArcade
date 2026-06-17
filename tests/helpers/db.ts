import { prisma } from "@/lib/db";

// Truncate all tables between integration tests, in FK-safe order (children first).
export async function resetDb(): Promise<void> {
  await prisma.followUpNote.deleteMany();
  await prisma.listingPhoto.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();
}

export { prisma };
