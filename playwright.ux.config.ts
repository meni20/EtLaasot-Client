import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/ux-ui",
  testMatch: "*.spec.ts",
  workers: 1,
  retries: 0,
  timeout: 30000,
  reporter: "list",
  outputDir: ".registration-qa/ux",
  use: {
    baseURL: "http://127.0.0.1:5185",
    viewport: { width: 390, height: 844 },
    locale: "he-IL",
    hasTouch: true,
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npx vite --config vite.ux.config.ts",
    url: "http://127.0.0.1:5185/ux-demo.html",
    reuseExistingServer: false,
  },
});
