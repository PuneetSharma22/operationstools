import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    globals: true,
    // Exclude Playwright E2E tests — those run via `npm run test:e2e`
    exclude: ["tests/e2e/**", "node_modules/**"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
