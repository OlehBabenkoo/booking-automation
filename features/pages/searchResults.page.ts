import { expect, Locator, Page, test } from '@playwright/test';

export class SearchResultsPage {
  private readonly heading: Locator;

  constructor(public readonly page: Page) {
    this.heading = this.page.getByRole('heading', { level: 1 });
  }

  public async verifyOpened(): Promise<void> {
    await test.step('Verify Search Results page is opened', async () => {
      await expect(this.page).toHaveURL(/\/searchresults\./);
    });
  }

  public async verifyHeading(value: RegExp): Promise<void> {
    await test.step(`Verify heading matches ${value}`, async () => {
      await expect(this.heading).toHaveText(value);
    });
  }
}
