import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { VIEWPORT } from '@utils/viewports';
import { rpConfig } from './rpConfig/rpConfig';

export default defineConfig({
  timeout: 60_000,
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['html'], ['list'], ['@reportportal/agent-js-playwright', rpConfig]]
    : [['html'], ['list']],
  use: {
    baseURL: 'https://www.booking.com/',
    // Tests start in en-gb; Booking may pick the "current" language from Accept-Language (default en-US)
    locale: 'en-GB',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chrome-desktop',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: VIEWPORT.fullHd,
      },
    },
    {
      name: 'chrome-mobile',
      use: {
        ...devices['Pixel 7'],
        channel: 'chrome',
      },
    },
    {
      name: 'safari-desktop',
      timeout: 70_000, // Booking renders slowly in WebKit
      use: {
        ...devices['Desktop Safari'],
        viewport: VIEWPORT.fullHd,
      },
    },
    {
      name: 'safari-mobile',
      timeout: 70_000, // Booking renders slowly in WebKit
      use: {
        ...devices['iPhone XR'],
      },
    },
  ],
});
