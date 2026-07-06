import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["app/lib/**/*.ts"],
      exclude: ["app/lib/**/*.{test,spec}.ts"]
    }
  }
});
