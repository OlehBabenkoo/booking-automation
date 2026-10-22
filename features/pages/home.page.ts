import { Locator, Page, test } from '@playwright/test';

type Language = 'en-gb' | 'uk';

export class HomePage {
  private readonly signInModalDismissButton: Locator;

  constructor(public readonly page: Page) {
    this.signInModalDismissButton = this.page.getByRole('button', {
      name: /Dismiss sign.in info/i,
    });
  }

  public async open(language: Language = 'en-gb'): Promise<void> {
    await test.step(`Open Home page (lang=${language})`, async () => {
      await this.page.goto(`/?lang=${language}`);
      await this.dismissSignInModal();
    });
  }

  private async dismissSignInModal(): Promise<void> {
    await test.step('Dismiss "Sign in" modal if it appears', async () => {
      await this.signInModalDismissButton.click({ timeout: 10_000 }).catch(() => {});
    });
  }
}
