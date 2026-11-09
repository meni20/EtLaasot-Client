import { defineConfig } from "@playwright/test";
import base from "./playwright.password.config";
export default defineConfig({
  ...base,
  testDir: "./tests/phase4-ui",
  outputDir: ".registration-qa/password-legacy",
  webServer: {
    command: "npx vite --config vite.password.config.ts",
    url: "http://127.0.0.1:5194/password-demo.html",
    reuseExistingServer: false,
    timeout: 30000,
    env: { PASSWORD_UI_DISABLED: "true" },
  },
});
