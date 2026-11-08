import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { VIEWPORT } from '@utils/viewports';
import { rpConfig } from './rpConfig/rpConfig';
import { storageStateFilePath } from '@utils/storageStatePath';

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
      name: 'storageState',
      testMatch: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: VIEWPORT.fullHd,
      },
    },
    {
      name: 'chrome-desktop',
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: VIEWPORT.fullHd,
        storageState: storageStateFilePath,
      },
      dependencies: ['storageState'],
    },
    {
      name: 'chrome-mobile',
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices['Pixel 7'],
        channel: 'chrome',
      },
      dependencies: ['storageState'],
    },
    {
      name: 'safari-desktop',
      timeout: 70_000, // Booking renders slowly in WebKit
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Safari'],
        viewport: VIEWPORT.fullHd,
      },
      dependencies: ['storageState'],
    },
    {
      name: 'safari-mobile',
      timeout: 70_000, // Booking renders slowly in WebKit
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices['iPhone XR'],
      },
      dependencies: ['storageState'],
    },
  ],
});
