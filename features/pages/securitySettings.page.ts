import { errors, expect, type Page, test } from '@playwright/test';
import { BasePage } from './base.page.js';

export class SecuritySettingsPage extends BasePage {
  private readonly passkeysRow = this.page.locator('[data-test-id="mysettings-row-security_passkeys"]');
  private readonly editPasskeysButton = this.passkeysRow.locator('[data-test-id="mysettings-btn-edit"]');
  private readonly addPasskeyButton = this.passkeysRow.getByRole('button', { name: 'Add a new Passkey' });
  private readonly passkeyIntroDialog = this.page.getByRole('dialog', {
    name: 'Easily sign in with biometrics',
  });
  private readonly setUpPasskeysButton = this.passkeyIntroDialog.getByRole('button', {
    name: 'Set up Passkeys',
  });
  private readonly verificationDialog = this.page.getByRole('dialog', { name: 'Enter verification code' });
  private readonly codeInputs = this.verificationDialog.getByRole('textbox', {
    name: /Enter verification code character/,
  });
  private readonly verifyButton = this.verificationDialog.getByRole('button', { name: 'Verify email' });

  constructor(page: Page, isMobile: boolean) {
    super(page, 'https://account.booking.com/mysettings/security?lang=en-gb', isMobile);
  }

  override async open(): Promise<void> {
    await test.step('Open Security settings page', async () => {
      await super.open();
      await expect(this.passkeysRow).toBeVisible();
    });
  }

  async startAddingPasskey(): Promise<void> {
    await test.step('Click "Add a new Passkey"', async () => {
      if (!(await this.addPasskeyButton.isVisible())) {
        await this.editPasskeysButton.click();
      }
      await expect(this.setUpPasskeysButton.or(this.addPasskeyButton).first()).toBeVisible();
      if (!(await this.setUpPasskeysButton.isVisible())) {
        await this.addPasskeyButton.click();
        await this.confirmIntroDialogIfShown();
        return;
      }
      await this.setUpPasskeysButton.click();
    });
  }

  async confirmEnrollmentWithCode(code: string): Promise<void> {
    await test.step(`Confirm passkey enrollment with code "${code}"`, async () => {
      await expect(this.codeInputs).toHaveCount(code.length);
      for (const [index, char] of [...code].entries()) {
        await this.codeInputs.nth(index).fill(char);
      }
      await this.verifyButton.click();
      await expect(this.verificationDialog).toBeHidden();
    });
  }

  private async confirmIntroDialogIfShown(): Promise<void> {
    try {
      await this.setUpPasskeysButton.waitFor({ state: 'visible', timeout: 5_000 });
    } catch (error) {
      if (error instanceof errors.TimeoutError) return;
      throw error;
    }
    await this.setUpPasskeysButton.click();
  }
}
