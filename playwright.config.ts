import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";
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
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: VIEWPORT.fullHd,
      },
    },
    {
      name: "chrome-mobile",
      use: {
        ...devices["Pixel 7"],
        channel: "chrome",
      },
    },
    {
      name: "safari-desktop",
      use: {
        ...devices["Desktop Safari"],
        viewport: VIEWPORT.fullHd,
      },
    },
    {
      name: "safari-mobile",
      use: {
        ...devices["iPhone XR"],
      },
    },
  ],
});
