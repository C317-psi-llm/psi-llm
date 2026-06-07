import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Vite config sets `base: '/psi-llm/'`, so tests should use that path
    baseUrl: "http://localhost:5173/psi-llm",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // implement node event listeners here if needed
      return config;
    },
  },
});
