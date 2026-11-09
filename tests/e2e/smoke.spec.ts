import { expect, test } from '@playwright/test';
import { TAG } from '@utils/testData/tags';

test('homepage is available', { tag: [TAG.smoke, TAG.regression] }, async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
});
//change to check the ci job
