import { PrismaClient } from "@prisma/client";

// Seeds the single OWNER (Super Admin) account, enforcing the prj.md Section 9
// invariant that exactly one OWNER exists. Credentials come from the environment.
//
// TDD: the password-hashing + Better Auth wiring is implemented behind a failing
// test first (see src/lib/auth.test.ts, to be added). This seed currently sets up
// the User row; the credential/Account row is created via the auth layer.

const prisma = new PrismaClient();

async function main() {
  const email = process.env.OWNER_EMAIL;
  const name = process.env.OWNER_NAME ?? "Ghats Arcade Owner";

  if (!email) {
    throw new Error("OWNER_EMAIL must be set to seed the Owner account.");
  }

  const existingOwner = await prisma.user.findFirst({ where: { role: "OWNER" } });
  if (existingOwner) {
    console.log(`Owner already exists (${existingOwner.email}); skipping.`);
    return;
  }

  const owner = await prisma.user.create({
    data: { email, name, role: "OWNER", emailVerified: true, isActive: true },
  });
  console.log(`Created OWNER account: ${owner.email}`);
  console.log("Set the Owner password via the Better Auth flow (see src/lib/auth.ts).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
