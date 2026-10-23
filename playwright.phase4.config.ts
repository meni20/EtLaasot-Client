import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/phase4-ui",
  workers: 1,
  retries: 0,
  timeout: 30000,
  reporter: "list",
  outputDir: ".registration-qa/phase4",
  use: {
    baseURL: "http://127.0.0.1:5184",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    locale: "he-IL",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
    screenshot: "only-on-failure",
    trace: "off",
  },
  webServer: {
    command: "npm run dev:phase4",
    url: "http://127.0.0.1:5184/phase4-demo.html",
    reuseExistingServer: false,
    timeout: 30000,
  },
});
