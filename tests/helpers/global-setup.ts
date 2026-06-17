import { execSync } from "node:child_process";

// Provisions the SQLite integration test database once before the suite runs.
// `db push --force-reset` drops and recreates the schema so every run starts clean.
export default function setup() {
  const databaseUrl = "file:./test.db";
  execSync("npx prisma db push --force-reset --skip-generate", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
}
