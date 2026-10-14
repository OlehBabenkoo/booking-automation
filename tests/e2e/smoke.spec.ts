import { expect, test } from '@playwright/test';

test('homepage is available', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
});
//change to check the ci job
