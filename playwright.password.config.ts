import { defineConfig } from "@playwright/test";
import base from "./playwright.phase4.config";
export default defineConfig({
  ...base,
  use: { ...base.use, baseURL: "http://127.0.0.1:5194" },
  testDir: "./tests/password-ui",
  outputDir: ".registration-qa/password",
  webServer: {
    command: "npx vite --config vite.password.config.ts",
    url: "http://127.0.0.1:5194/password-demo.html",
    reuseExistingServer: false,
    timeout: 30000,
  },
});
