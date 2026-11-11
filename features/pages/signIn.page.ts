import { expect, type Page, test } from '@playwright/test';
import { BasePage } from './base.page.js';

export class SignInPage extends BasePage {
  private readonly continueButton = this.page.getByRole('button', {
    name: 'Continue with email',
  });
  private readonly emailInput = this.page.getByRole('textbox', {
    name: 'Email address',
  });
  private readonly emailError = this.page.locator('#username-note');

  constructor(page: Page) {
    super(page, 'https://account.booking.com/sign-in?lang=en-gb');
  }

  override async open(): Promise<void> {
    await test.step('Open Sign In page', async () => {
      await super.open();
      await expect(this.emailInput).toBeVisible();
    });
  }

  async submitEmail(email: string): Promise<void> {
    await test.step(`Submit email "${email}"`, async () => {
      await this.emailInput.fill(email);
      await this.continueButton.click();
    });
  }

  async verifyEmailError(expectedText: string): Promise<void> {
    await test.step(`Verify email error "${expectedText}"`, async () => {
      await expect(this.emailError).toBeVisible();
      await expect(this.emailError).toHaveText(expectedText);
    });
  }
}
