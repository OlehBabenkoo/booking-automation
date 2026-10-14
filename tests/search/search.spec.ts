import { test } from '@utils/fixtures';

test.describe('Search', () => {
  test('Test filling in "Destination" field', async ({ searchComponent, page }) => {
    await page.goto('/');

    await searchComponent.fillDestination('Lviv');
    await searchComponent.verifyDestinationValue('Lviv');
  });
});
