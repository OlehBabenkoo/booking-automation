import { errors, expect, type Page, test } from '@playwright/test';
import type { Language } from '@utils/testData/languages';
import { BasePage } from './base.page.js';

export class HomePage extends BasePage {
  private readonly signInModalDismissButton = this.page.getByRole('button', {
    name: /Dismiss sign.in info/i,
  });
  private readonly destinationInput = this.page.locator('#searchbox-horizontal-destination-input');

  constructor(page: Page) {
    super(page, '/');
  }

  override async open(language: Language = 'en-gb'): Promise<void> {
    await test.step(`Open Home page (lang=${language})`, async () => {
      await this.page.goto(`/?lang=${language}`);
      await expect(this.destinationInput).toBeVisible({ timeout: 15_000 });

      const url = new URL(this.page.url());
      const requestedLanguageIsSet =
        url.searchParams.get('lang') === language || url.pathname.endsWith(`/index.${language}.html`);

      if (!requestedLanguageIsSet) {
        await this.page.goto(`/?lang=${language}`);
        await expect(this.destinationInput).toBeVisible({ timeout: 15_000 });
      }

      await this.dismissSignInInfo();
    });
  }

  async dismissSignInInfo(): Promise<void> {
    await test.step('Dismiss sign-in modal if it appears', async () => {
      try {
        await this.signInModalDismissButton.waitFor({
          state: 'visible',
          timeout: 10_000,
        });
      } catch (error) {
        if (error instanceof errors.TimeoutError) {
          return;
        }
        throw error;
      }
      await this.signInModalDismissButton.click();
      await expect(this.signInModalDismissButton).toBeHidden();
    });
  }
}
