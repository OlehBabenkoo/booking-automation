import { expect, Locator, Page, test } from '@playwright/test';

export class SearchResultsPage {
  private readonly heading: Locator;
  private readonly propertyCards: Locator;
  private readonly searchSummary: Locator;

  constructor(public readonly page: Page) {
    this.heading = this.page.getByRole('heading', { level: 1 });
    this.propertyCards = this.page.getByTestId('property-card');
    this.searchSummary = this.page.getByTestId('sb-minified');
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

  public async verifyPropertyCardsVisible(): Promise<void> {
    await test.step('Verify property cards are visible', async () => {
      await expect(this.propertyCards.first()).toBeVisible();
    });
  }

  // Mobile layout collapses the search form into a summary bar
  public async verifySearchSummary(value: RegExp): Promise<void> {
    await test.step(`Verify search summary matches ${value}`, async () => {
      await expect(this.searchSummary).toHaveText(value);
    });
  }

  public async verifySearchParams(expected: Record<string, string>): Promise<void> {
    await test.step('Verify search parameters in the URL', async () => {
      const params = new URL(this.page.url()).searchParams;
      const actual = Object.fromEntries(Object.keys(expected).map((name) => [name, params.get(name)]));

      expect(actual).toEqual(expected);
    });
  }
}
