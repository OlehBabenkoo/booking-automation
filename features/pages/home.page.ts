import { expect, type Page, test } from '@playwright/test';
import type { Language } from '@utils/testData/languages';
import { BasePage } from './base.page.js';

export class HomePage extends BasePage {
  private readonly searchBox = this.page
    .locator('#SearchBoxDesktop') // desktop
    .or(this.page.locator('#SearchBoxMobile')); // mobile

  constructor(page: Page) {
    super(page, '/');
  }

  private async waitForPageToLoad(): Promise<void> {
    await expect(this.searchBox).toBeVisible({ timeout: 15_000 });
    await this.page.waitForLoadState('load');
  }

  override async open(language: Language = 'en-gb'): Promise<void> {
    await test.step(`Open Home page (lang=${language})`, async () => {
      await this.page.goto(`/?lang=${language}`);
      await this.waitForPageToLoad();

      const url = new URL(this.page.url());
      const requestedLanguageIsSet =
        url.searchParams.get('lang') === language || url.pathname.endsWith(`/index.${language}.html`);

      if (!requestedLanguageIsSet) {
        await this.page.goto(`/?lang=${language}`);
        await this.waitForPageToLoad();
      }
    });
  }
}
