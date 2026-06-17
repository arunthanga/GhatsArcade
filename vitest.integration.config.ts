import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

// DB-backed integration tests (*.integration.test.ts). A real SQLite test database
// is provisioned once by tests/helpers/global-setup.ts (`prisma db push --force-reset`),
// and resetDb() truncates tables between tests.
//
// IMPORTANT: SQLite paths in Prisma resolve relative to prisma/schema.prisma, so the
// test DB lives at prisma/test.db (DATABASE_URL="file:./test.db").
export default defineConfig({
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.integration.test.ts", "tests/**/*.integration.test.ts"],
    globalSetup: ["./tests/helpers/global-setup.ts"],
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "file:./test.db",
      BETTER_AUTH_SECRET: "integration-test-secret",
      BETTER_AUTH_URL: "http://localhost:3000",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    },
    // Integration tests share one DB; avoid cross-file parallelism races.
    fileParallelism: false,
  },
});
