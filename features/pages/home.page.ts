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

  private isLanguageSet(language: Language): boolean {
    const url = new URL(this.page.url());
    return url.searchParams.get('lang') === language || url.pathname.endsWith(`/index.${language}.html`);
  }

  protected override async waitForPageReady(): Promise<void> {
    await expect(this.searchBox).toBeVisible({ timeout: 15_000 });
    await this.page.waitForLoadState('load');
  }

  override async open(language: Language = 'en-gb'): Promise<void> {
    await test.step(`Open Home page (lang=${language})`, async () => {
      const url = `${this.path}?lang=${language}`;

      await super.open(url);

      if (!this.isLanguageSet(language)) {
        await super.open(url);
      }
    });
  }
}
