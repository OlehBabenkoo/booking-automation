import { expect, Locator, Page, test } from '@playwright/test';
import type { Language } from '@utils/testData/languages';

export class HomePage {
  private readonly signInModalDismissButton: Locator;
  private readonly destinationInput: Locator;

  constructor(public readonly page: Page) {
    this.signInModalDismissButton = this.page.getByRole('button', {
      name: /Dismiss sign.in info/i,
    });
    this.destinationInput = this.page.locator('#searchbox-horizontal-destination-input');
  }

  public async open(language: Language = 'en-gb'): Promise<void> {
    await test.step(`Open Home page (lang=${language})`, async () => {
      await this.page.goto(`/?lang=${language}`);
      // Booking keeps the language as "?lang=en-gb" or "/index.en-gb.html", but its bot check (seen on CI)
      // redirects to a URL without it, so the site falls back to en-us
      await expect(this.destinationInput).toBeVisible({ timeout: 15_000 });
      if (!new RegExp(`[.=]${language}([.&]|$)`).test(this.page.url())) {
        await this.page.goto(`/?lang=${language}`);
      }
      await this.dismissSignInModal();
    });
  }

  private async dismissSignInModal(): Promise<void> {
    await test.step('Dismiss "Sign in" modal if it appears', async () => {
      await this.signInModalDismissButton.click({ timeout: 10_000 }).catch(() => {});
    });
  }
}
