import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/registration-ui",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30000,
  reporter: "list",
  outputDir: ".registration-qa/test-results",
  use: {
    baseURL: "http://127.0.0.1:5183",
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
    command: "npm run dev:registration",
    url: "http://127.0.0.1:5183/parent-registration-demo.html",
    reuseExistingServer: true,
    timeout: 30000,
  },
});
