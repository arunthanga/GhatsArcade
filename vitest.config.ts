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
    // Co-located unit/component/integration tests run by default.
    // Regression suites live in tests/regression and run on demand
    // via `pnpm test:regression` (excluded here so they are not run every commit).
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
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
