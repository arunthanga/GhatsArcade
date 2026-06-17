import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Dummy env so modules that import src/lib/env.ts do not throw during unit tests.
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "file:./test-unit.db",
      BETTER_AUTH_SECRET: "unit-test-secret",
      BETTER_AUTH_URL: "http://localhost:3000",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    },
    // Co-located unit/component tests run by default. DB-backed *.integration.test.ts
    // run via `pnpm test:integration`. Regression suites (tests/regression) run on
    // demand via `pnpm test:regression`.
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["**/node_modules/**", "**/*.integration.test.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "tests/reports/coverage",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      // roles/permissions logic must reach 100% branch coverage (prj.md Section 9).
      thresholds: {
        "src/lib/roles.ts": {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
      },
    },
  },
});
