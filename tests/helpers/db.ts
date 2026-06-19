import { prisma } from "@/lib/db";

// Truncate all tables between integration tests, in FK-safe order (children first).
export async function resetDb(): Promise<void> {
  await prisma.horticultureLog.deleteMany();
  await prisma.followUpNote.deleteMany();
  await prisma.eventPhoto.deleteMany();
  await prisma.projectPhoto.deleteMany();
  await prisma.listingPhoto.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.event.deleteMany();
  await prisma.plot.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.project.deleteMany();
  await prisma.leadMagnetAsset.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
}

export { prisma };
