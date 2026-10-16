import { Locator, Page, test } from '@playwright/test';

export class HomePage {
  private readonly signInModalDismissButton: Locator;

  constructor(public readonly page: Page) {
    this.signInModalDismissButton = this.page.getByRole('button', {
      name: /Dismiss sign.in info/i,
    });
  }

  public async open(): Promise<void> {
    await test.step('Open Home page in English (UK)', async () => {
      await this.page.goto('/?lang=en-gb');
      await this.dismissSignInModal();
    });
  }

  private async dismissSignInModal(): Promise<void> {
    await test.step('Dismiss "Sign in" modal if it appears', async () => {
      await this.signInModalDismissButton.click({ timeout: 10_000 }).catch(() => {});
    });
  }
}
