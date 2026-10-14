import { test } from '@utils/fixtures';

test.describe('Search', () => {
  test.skip(({ isMobile }) => isMobile, 'Mobile search box is not supported yet');

  test('Test filling in "Destination" field', async ({ searchComponent, page }) => {
    await page.goto('/');

    await searchComponent.fillDestination('Lviv');
    await searchComponent.verifyDestinationValue('Lviv');
  });
});
