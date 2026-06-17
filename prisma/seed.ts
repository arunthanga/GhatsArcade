import { prisma } from "@/lib/db";
import { isValidOwnerCount } from "@/lib/roles";
import { createCredentialedUser } from "@/server/users";

// Seeds the single OWNER (Super Admin) account with a working email/password
// credential, enforcing the prj.md Section 9 invariant that exactly one OWNER exists.
// Idempotent: re-running does nothing once an Owner is present.
async function main() {
  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;
  const name = process.env.OWNER_NAME ?? "Ghats Arcade Owner";

  if (!email || !password) {
    throw new Error("OWNER_EMAIL and OWNER_PASSWORD must be set to seed the Owner account.");
  }

  const existingOwner = await prisma.user.findFirst({ where: { role: "OWNER" } });
  if (existingOwner) {
    console.log(`Owner already exists (${existingOwner.email}); skipping.`);
    return;
  }

  const owner = await createCredentialedUser({ email, password, name, role: "OWNER" });

  const ownerCount = await prisma.user.count({ where: { role: "OWNER" } });
  if (!isValidOwnerCount(ownerCount)) {
    throw new Error(`Single-Owner invariant violated: found ${ownerCount} owners.`);
  }

  console.log(`Created OWNER account: ${owner.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
