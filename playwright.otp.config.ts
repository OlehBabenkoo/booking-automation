import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  grep: /@otp/,
  grepInvert: undefined,
  fullyParallel: false,
  workers: 1,
});
