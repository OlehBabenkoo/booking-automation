import "dotenv/config";
import { defineConfig } from "@playwright/test";
import { VIEWPORT } from "./utils/viewports";

const baseURL = process.env.BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chrome-desktop",
      use: {
        browserName: "chromium",
        channel: "chrome",
        viewport: VIEWPORT.fullHd,
      },
    },
    {
      name: "chrome-mobile",
      use: {
        browserName: "chromium",
        channel: "chrome",
        viewport: VIEWPORT.mobile,
      },
    },
    {
      name: "safari-desktop",
      use: {
        browserName: "webkit",
        viewport: VIEWPORT.fullHd,
      },
    },
    {
      name: "safari-mobile",
      use: {
        browserName: "webkit",
        viewport: VIEWPORT.mobile,
      },
    },
  ],
});
