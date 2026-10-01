import "dotenv/config";
import { defineConfig } from "@playwright/test";

const baseURL = process.env.BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  retries: 1,
  reporter: [["html"]],
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
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "chrome-mobile",
      use: {
        browserName: "chromium",
        channel: "chrome",
        viewport: { width: 414, height: 896 },
      },
    },
    {
      name: "safari-desktop",
      use: {
        browserName: "webkit",
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "safari-mobile",
      use: {
        browserName: "webkit",
        viewport: { width: 414, height: 896 },
      },
    },
  ],
});
