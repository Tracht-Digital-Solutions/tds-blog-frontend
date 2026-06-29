import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Unit-test harness for the blog's framework-agnostic logic. Astro stays
 * on `npm run type-check`; this only covers `src/lib` helpers and React
 * islands. Default env is jsdom so island tests work; pure suites don't care.
 */
export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
