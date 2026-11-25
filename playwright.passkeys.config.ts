import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  testDir: './tests/setup',
  testMatch: /registerPasskeys\.setup\.ts/,
  projects: baseConfig.projects?.filter((project) => project.name === 'chrome-desktop'),
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
});
